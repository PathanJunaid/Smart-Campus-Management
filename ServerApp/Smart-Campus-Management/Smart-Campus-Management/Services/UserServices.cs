﻿using System.Security.Claims;
using System.Text;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.DTO;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using OfficeOpenXml;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Smart_Campus_Management.Services
{
    public class UserServices : IUserServices
    {
        private readonly AppDbContext dbcontext;
        private readonly IConfiguration _Config;
        private readonly IEmailService _emailService;
        private readonly ILogServices _logServices;
        private readonly IEnrollmentServices _enrollmentServices;

        public UserServices(AppDbContext dbcontext, IConfiguration config, IEmailService emailService, ILogServices logServices, IEnrollmentServices enrollmentServices)
        {
            this.dbcontext = dbcontext;
            this._Config = config;
            _emailService = emailService;
            _logServices = logServices;
            _enrollmentServices = enrollmentServices;
        }

        public async Task<UploadResponseDTO> UploadStudentOrFaculty(UploadStudentorFacultyDTO UploadedData)
        {
            var response = new UploadResponseDTO
            {
                Errors = new List<string>(),
                Successes = new List<string>()
            };

            List<string> ExcelHeading = new List<string>();

            try
            {
                // Define valid database keys (corresponding to User entity properties)
                var validDbKeys = new List<string>
                {
                    "FirstName",
                    "MiddleName",
                    "LastName",
                    "Email",
                    "RollNo",
                    "MobileNumber",
                    "DOB",
                    "Role",
                    "Department",
                    "EmployeeId"
                };

                // Validate role
                if (UploadedData.Role != UserRole.Student && UploadedData.Role != UserRole.Faculty)
                {
                    var error = "Invalid role. Only Student or Faculty roles are allowed.";
                    await _logServices.LogToDatabase("UserImport", "Failure", error, "{}");
                    response.Errors.Add(error);
                    response.Message = "Upload failed";
                    return response;
                }

                using (var stream = new MemoryStream())
                {
                    await UploadedData.File.CopyToAsync(stream);
                    stream.Position = 0;

                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0];
                        var rowCount = worksheet.Dimension?.Rows ?? 0;
                        var colCount = worksheet.Dimension?.Columns ?? 0;

                        if (rowCount < 1 || colCount < 1)
                        {
                            var error = "The Excel file is empty or invalid.";
                            await _logServices.LogToDatabase("UserImport", "Failure", error, "{}");
                            response.Errors.Add(error);
                            response.Message = "Upload failed";
                            return response;
                        }

                        // Read and validate headers
                        var headerMap = new Dictionary<int, string>();
                        for (int col = 1; col <= colCount; col++)
                        {
                            string header = worksheet.Cells[1, col].Text?.Trim();
                            if (string.IsNullOrEmpty(header))
                            {
                                continue;
                            }

                            ExcelHeading.Add(header);

                            if (validDbKeys.Any(key => key.Equals(header, StringComparison.OrdinalIgnoreCase)))
                            {
                                headerMap[col] = header.ToLower();
                            }
                        }

                        // Check required fields
                        var requiredFields = new List<string> { "firstname", "email" };
                        if (!requiredFields.All(field => headerMap.Values.Contains(field.ToLower())))
                        {
                            var error = "Missing required headers: FirstName, Email.";
                            await _logServices.LogToDatabase("UserImport", "Failure", error, "{}");
                            response.Errors.Add(error);
                            response.Message = "Upload failed";
                            return response;
                        }

                        // Process rows
                        for (int row = 2; row <= rowCount; row++)
                        {
                            var user = new User
                            {
                                Role = UploadedData.Role,
                                Active = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow
                            };

                            // Traverse valid headers
                            foreach (var header in headerMap)
                            {
                                int col = header.Key;
                                string dbKey = header.Value;
                                var cell = worksheet.Cells[row, col];
                                string cellValue = cell.Text?.Trim() ?? string.Empty;
                                object rawValue = cell.Value; // Get raw cell value

                                switch (dbKey)
                                {
                                    case "firstname":
                                        user.FirstName = cellValue;
                                        break;
                                    case "middlename":
                                        user.MiddleName = cellValue;
                                        break;
                                    case "lastname":
                                        user.LastName = cellValue;
                                        break;
                                    case "email":
                                        user.Email = cellValue.ToLower();
                                        break;
                                    case "rollno":
                                        if (rawValue != null)
                                        {
                                            // Handle numeric or text values
                                            string rollNoStr = rawValue switch
                                            {
                                                double num => num.ToString("F0"), // Convert number to string without scientific notation
                                                string str => str,
                                                _ => rawValue.ToString()
                                            };
                                            if (long.TryParse(rollNoStr, out long rollNo) && user.Role == UserRole.Student)
                                            {
                                                user.RollNo = rollNo;
                                            }
                                            else
                                            {
                                                user.RollNo = null;
                                                var error = $"Row {row}: Invalid RollNo format ({rollNoStr}).";
                                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user));
                                                response.Errors.Add(error);
                                            }
                                        }
                                        else
                                        {
                                            user.RollNo = null;
                                        }
                                        break;
                                    case "mobilenumber":
                                        user.MobileNumber = long.TryParse(cellValue, out long mobile) ? mobile : null;
                                        break;
                                    case "dob":
                                        user.DOB = DateOnly.TryParse(cellValue, out DateOnly dob) ? dob : null;
                                        break;
                                    case "role":
                                        if (Enum.TryParse<UserRole>(cellValue, true, out var role))
                                        {
                                            user.Role = role;
                                        }
                                        break;
                                    case "department":
                                        if (Enum.TryParse<Departments>(cellValue, true, out var department) && user.Role == UserRole.Faculty)
                                        {
                                            user.Department = department;
                                        }
                                        break;
                                    case "employeeid":
                                        if (int.TryParse(cellValue, out int employeeId) && user.Role == UserRole.Faculty)
                                        {
                                            user.EmployeeId = employeeId;
                                        }
                                        else
                                        {
                                            user.EmployeeId = null;
                                            var error = $"Row {row}: Invalid EmployeeId format ({cellValue}).";
                                            await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user));
                                            response.Errors.Add(error);
                                        }
                                        break;
                                }
                            }

                            // Validate required fields
                            if (string.IsNullOrEmpty(user.FirstName) || string.IsNullOrEmpty(user.Email))
                            {
                                var error = $"Row {row}: Missing required fields (FirstName: {user.FirstName}, Email: {user.Email}).";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user));
                                response.Errors.Add(error);
                                continue;
                            }

                            // Validate email format
                            if (!IsValidEmail(user.Email))
                            {
                                var error = $"Row {row}: Invalid email format ({user.Email}).";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user));
                                response.Errors.Add(error);
                                continue;
                            }

                            // Check for duplicate email
                            if (await dbcontext.Users.AnyAsync(u => u.Email == user.Email))
                            {
                                var error = $"Row {row}: Email {user.Email} already exists.";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user));
                                response.Errors.Add(error);
                                continue;
                            }

                            // Check for duplicate RollNo (if provided)
                            if (user.RollNo.HasValue && await dbcontext.Users.AnyAsync(u => u.RollNo == user.RollNo))
                            {
                                var error = $"Row {row}: RollNo {user.RollNo} already exists.";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user.Email));
                                response.Errors.Add(error);
                                continue;
                            }

                            // Check for duplicate EmployeeId (if provided)
                            if (user.EmployeeId.HasValue && await dbcontext.Users.AnyAsync(u => u.EmployeeId == user.EmployeeId))
                            {
                                var error = $"Row {row}: EmployeeId {user.EmployeeId} already exists.";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user.Email));
                                response.Errors.Add(error);
                                continue;
                            }

                            // Attempt to add user
                            using var transaction = await dbcontext.Database.BeginTransactionAsync();
                            try
                            {
                                await dbcontext.Users.AddAsync(user);
                                await dbcontext.SaveChangesAsync();
                                if (UploadedData.DepartmentId != null)
                                {
                                    AddEnrollmentDTO addEnrollmentDTO = new AddEnrollmentDTO
                                    {
                                        DepartmentId = (int)UploadedData.DepartmentId,
                                        StudentId = user.Id,
                                    };
                                    var result = await _enrollmentServices.AddEnrollment(addEnrollmentDTO);
                                    if (!result.Success)
                                    {
                                        throw new Exception(result.Message);
                                    }
                                }
                                await transaction.CommitAsync();
                                var success = $"Row {row}: User {user.Email} added successfully.";
                                await _logServices.LogToDatabase("UserImport", "Success", success, JsonSerializer.Serialize(user.Email));
                                response.Successes.Add(success);
                            }
                            catch (DbUpdateException ex)
                            {
                                await transaction.RollbackAsync();
                                var error = $"Row {row}: Failed to add user {user.Email}: {ex.InnerException?.Message ?? ex.Message}";
                                await _logServices.LogToDatabase("UserImport", "Failure", error, JsonSerializer.Serialize(user.Email));
                                response.Errors.Add(error);
                                dbcontext.ChangeTracker.Clear();
                            }
                        }
                    }
                }

                response.Message = $"Upload completed with {response.Successes.Count} successes and {response.Errors.Count} errors.";
                return response;
            }
            catch (Exception ex)
            {
                var error = $"File upload failed: {ex.Message}";
                await _logServices.LogToDatabase("UserImport", "Failure", error, "{}");
                response.Errors.Add(error);
                response.Message = "Upload failed";
                return response;
            }
        }

        // Helper method to log to database
        
        // Helper method to validate email format
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public async Task<SignUpResponseDTO> SignUpStep1(userSignUpStep1DTO signUpData)
        {
            var response = new SignUpResponseDTO
            {
                Errors = new List<string>()
            };

            try
            {
                // Validate input
                if (string.IsNullOrEmpty(signUpData.Email))
                {
                    response.Errors.Add("Email is required.");
                    response.Message = "Invalid input.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Validate email format
                if (!IsValidEmail(signUpData.Email))
                {
                    response.Errors.Add("Invalid email format.");
                    response.Message = "Invalid input.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Check if user exists with Email and RollNo
                var user = await dbcontext.Users
                    .FirstOrDefaultAsync(u => u.Email == signUpData.Email);

                if (user == null)
                {
                    // Check which field(s) did not match
                    var emailExists = await dbcontext.Users.AnyAsync(u => u.Email == signUpData.Email);

                    if (!emailExists)
                    {
                        response.Errors.Add("No user found with the provided Email.");
                    }else if (user.Password== null)
                    {
                        response.Errors.Add("Already Registered. Please Login");
                    }
                    response.Message = "User verification failed.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }
                if (user.Password != null)
                {
                    response.Errors.Add("Already Registered. Please Login");
                    response.Message = "Already Registered.";
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Generate OTP (6-digit)
                var random = new Random();
                int otp = random.Next(100000, 999999);

                
                try
                {
                    // Save OTP to database
                    var otpRecord = new OtpRecord
                    {
                        Email = signUpData.Email,
                        OTP = otp,
                        CreatedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddMinutes(10) // 10-minute expiry
                    };
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(otpRecord));
                    await dbcontext.OtpRecords.AddAsync(otpRecord);
                    await dbcontext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    response.Errors.Add("Unable to generate OTP. Please again");
                    response.Message = $"Unable to generate OTP. OTP Already Exists {otp}";
                    await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }
                

                // Send email with Email, Name, Password, and OTP
                var userName = $"{user.FirstName} {user.LastName}".Trim();
                var IsEmailSuccess = await SendSignUpEmail(signUpData.Email, userName, otp);


                response.Message = IsEmailSuccess;
                response.Success = true;
                await _logServices.LogToDatabase("SignUpStep1", "Success", response.Message, JsonSerializer.Serialize(new { signUpData.Email }));
                return response;
            }
            catch (Exception ex)
            {
                response.Errors.Add($"Signup failed: {ex.Message}");
                response.Message = "An error occurred during signup.";
                response.Success = false;
                await _logServices.LogToDatabase("SignUpStep1", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                return response;
            }
        }

        public async Task<SignUpResponseDTO> SignUpStep2(userSignUpStep2DTO signUpData)
        {
            var response = new SignUpResponseDTO
            {
                Errors = new List<string>()
            };

            try
            {
                // Validate input
                if (string.IsNullOrEmpty(signUpData.Email) || string.IsNullOrEmpty(signUpData.Password) || signUpData.OTP <= 0)
                {
                    response.Errors.Add("Email, Password, and OTP are required.");
                    response.Message = "Invalid input.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep2", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Validate email format
                if (!IsValidEmail(signUpData.Email))
                {
                    response.Errors.Add("Invalid email format.");
                    response.Message = "Invalid input.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep2", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Check if OTP exists and is valid
                var otpRecord = await dbcontext.OtpRecords
                    .FirstOrDefaultAsync(o => o.Email == signUpData.Email && o.OTP == signUpData.OTP && o.ExpiresAt > DateTime.UtcNow);

                if (otpRecord == null)
                {
                    response.Errors.Add("Invalid or expired OTP.");
                    response.Message = "OTP verification failed.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep2", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Check if user exists with Email and RollNo
                var user = await dbcontext.Users
                    .FirstOrDefaultAsync(u => u.Email == signUpData.Email);

                if (user == null)
                {
                    response.Errors.Add("No User found with the provided Email.");
                    response.Message = "User verification failed.";
                    response.Success = false;
                    await _logServices.LogToDatabase("SignUpStep2", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                    return response;
                }

                // Hash the password
                var hashedPassword = HashPassword(signUpData.Password);

                // Update user with password
                user.Password = hashedPassword;
                user.UpdatedAt = DateTime.UtcNow;
                dbcontext.Users.Update(user);

                // Delete OTP record
                dbcontext.OtpRecords.Remove(otpRecord);
                await dbcontext.SaveChangesAsync();

                response.Message = "User signup completed successfully.";
                response.Success = true;
                await _logServices.LogToDatabase("SignUpStep2", "Success", response.Message, JsonSerializer.Serialize(new { signUpData.Email}));
                return response;
            }
            catch (Exception ex)
            {
                response.Errors.Add($"Signup failed: {ex.Message}");
                response.Message = "An error occurred during signup.";
                response.Success = false;
                await _logServices.LogToDatabase("SignUpStep2", "Failure", response.Message, JsonSerializer.Serialize(signUpData));
                return response;
            }
        }

        private async Task<string> SendSignUpEmail(string email, string name, int otp)
        {
            var subject = "Smart Campus Management - Signup Verification";
            var body = $@"Dear {name},
            Thank you for signing up with Smart Campus Management. Below are your account details:

            Email: {email} OTP: {otp}

            Please use the OTP to complete your signup within 10 minutes.

            Best regards, Smart Campus Management Team";

            try
            {
                var IsEmailSuccess = await _emailService.SendEmailAsync(email, subject, body);
                return IsEmailSuccess;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending welcome email: " + ex.Message);
                return ex.Message;
            }

        }




        public async Task<User> UpdateUserAsync(Guid id, string Name)
        {
            try
            {
                var user = await FindUserAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found!");
                }
                user.FirstName = Name;
                dbcontext.Users.Update(user);
                await dbcontext.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("Update failed!", ex);
            }

        }

        public async Task<string> DeleteUserAsync(Guid id)
        {
            try
            {
                var user = await FindUserAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found!");
                }
                dbcontext.Users.Remove(user);
                await dbcontext.SaveChangesAsync();
                return $"User {id} deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Delete failed!", ex);
            }

        }
        public async Task<User?> FindUserByEmailAsync(string email)
        {
            try
            {
                return await Task.Run(() => dbcontext.Users.FirstOrDefault(u => u.Email == email.ToLower()));

            }
            catch (Exception ex)
            {
                throw new Exception("Find user failed!", ex);
            }
        }

        public async Task<User?> FindUserAsync(Guid id)
        {
            try
            {
                return await Task.Run(() => dbcontext.Users.FirstOrDefault(u => u.Id == id));

            }
            catch (Exception ex)
            {
                throw new Exception("Find user failed!", ex);
            }

        }


        public async Task<LoginResponseDTO> LoginService(Logindto logindata)
        {
            var response = new LoginResponseDTO
            {
                Errors = new List<string>()
            };

            try
            {
                // Validate input
                if (string.IsNullOrEmpty(logindata.Password))
                {
                    response.Success = false;
                    response.Message = "Password are required.";
                    response.Errors.Add("Invalid login details.");
                    await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(logindata));
                    return response;
                }

                // Find user by RollNo and Role = Student
                var user = await dbcontext.Users
                    .FirstOrDefaultAsync(u => u.Email == logindata.Email);

                if (user == null)
                {
                    response.Success = false;
                    response.Message = "No User found with the provided Email.";
                    response.Errors.Add("Invalid Email.");
                    await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(logindata.Email));
                    return response;
                }

                // Check if password is null (user not registered)
                if (string.IsNullOrEmpty(user.Password))
                {
                    response.Success = false;
                    response.Message = "Please register.";
                    response.NeedsRegistration = true;
                    await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(new { logindata.Email }));
                    return response;
                }

                // Verify password
                if (!VerifyPassword(logindata.Password, user.Password))
                {
                    response.Success = false;
                    response.Message = "Invalid password.";
                    response.Errors.Add("Incorrect password.");
                    await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(new { logindata.Email }));
                    return response;
                }

                // Generate JWT
                var jwt = GenerateJwtToken(user);

                response.Success = true;
                response.Message = "Login successful.";
                response.User = user;
                response.Jwt = jwt;
                await _logServices.LogToDatabase("Login", "Success", response.Message, JsonSerializer.Serialize(new { logindata.Email }));
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "An error occurred during login.";
                response.Errors.Add(ex.Message);
                await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(new { logindata, Exception = ex.Message }));
                return response;
            }
        }


        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12); // Secure bcrypt hashing
        }

        public bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHashedPassword);
        }

        private string GenerateJwtToken(User TokenData)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, TokenData.FirstName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, TokenData.Email),
                new Claim(ClaimTypes.Role, TokenData.Role.ToString()),
                new Claim("userId", TokenData.Id.ToString()),
                new Claim ("RollNo", TokenData.RollNo.ToString()),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Config["Jwt:JWTSECRET"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _Config["Jwt:ValidIssuer"],
                audience: _Config["Jwt:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private TokenDto DecodeJwtToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Extract claims
            var Id = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            var Name = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var Email = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
            var Role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            return new TokenDto { Id = Id != null ? Guid.Parse(Id) : Guid.Empty, Name = Name, Email = Email, Role = Enum.TryParse(typeof(UserRole), Role, out var parsedRole) ? (UserRole)parsedRole : UserRole.Student };

        }

    }
}
