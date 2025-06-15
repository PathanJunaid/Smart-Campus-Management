using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Services;
using System.Text.Json;

namespace Smart_Campus_Management.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class BasicUserController : Controller
    {
        private readonly IUserServices _userService;
        private readonly ILogServices _logServices;


        public BasicUserController(IUserServices userService, ILogServices logServices)
        {
            _userService = userService;
            _logServices = logServices;
        }
        // Update User
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] Namedto body)
        {
            try
            {
                var result = await _userService.UpdateUserAsync(id, body.Name);
                return Ok(new
                {
                    data = new
                    {
                        id = result.Id,
                        Name = result.FirstName,
                        Email = result.Email,
                        created_At = result.CreatedAt
                    },
                    message = "User Updated Successfully!",
                    success = true
                });

            }
            catch (Exception ex)
            {
                return NotFound(new { data = (object)null, message = "User not found!", success = false });
            }
        }



        // Delete User
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (result == null)
                {
                    throw new Exception("User not found");
                }
                return Ok(new { data = result, message = "User deleted Successfully!" });
            }
            catch (Exception ex)
            {
                return NotFound(new { data = (object)null, message = "User not found!", success = false });
            }

        }

        // Find User by Email
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> FindUser(Guid id)
        {
            try
            {
                var user = await _userService.FindUserAsync(id);
                if (user == null)
                {
                    throw new Exception("User not found");
                }
                return Ok(new
                {
                    data = user,
                    message = "User found!",
                    success = true
                });
            }
            catch (Exception ex)
            {
                return NotFound(new
                {
                    data = (object)null,
                    message = "User not found!",
                    success = false
                });
            }

        }


        /// <summary>
        /// Authenticates a user (Student, Faculty, or Admin) and returns a JWT token.
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// ```json
        /// {
        ///   "email": "user@campus.com",
        ///   "password": "password123"
        /// }
        /// ```
        /// </remarks>
        /// <param name="logindata">User login credentials.</param>
        /// <returns>JWT token and user details on success; error details on failure.</returns>
        /// <response code="200">Login successful, returns user data and JWT token.</response>
        /// <response code="400">Invalid login data.</response>
        /// <response code="500">Server error during login.</response>
        [HttpPost("/auth/login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] Logindto logindata)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    var response = new LoginResponseDTO
                    {
                        Success = false,
                        Message = "Invalid login data.",
                        Errors = errors
                    };
                    await _logServices.LogToDatabase("Login", "Failure", response.Message, JsonSerializer.Serialize(logindata));
                    return BadRequest(response);
                }

                var result = await _userService.LoginService(logindata);
                return Ok(new
                {
                    data = result.User == null ? null : new
                    {
                        id = result.User.Id,
                        FirstName = result.User.FirstName,
                        MiddleName = result.User.MiddleName,
                        LastName = result.User.LastName,
                        RollNO = result.User.RollNo,
                        Email = result.User.Email,
                        created_At = result.User.CreatedAt,
                        Role = result.User.Role,
                        DOB = result.User.DOB,
                        MobileNo = result.User.MobileNumber,
                        ProfilePicture = result.User.ProfilePicture,
                    },
                    accessToken = result.Jwt,
                    message = result.Message,
                    success = result.Success,
                    NeedsRegistration = result.NeedsRegistration,
                    Errors = result.Errors,

                });
            }
            catch (Exception ex)
            {
                var response = new LoginResponseDTO
                {
                    Success = false,
                    Message = "An error occurred during login.",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }


        /// <summary>
        /// Uploads an Excel file to add Students or Faculty in bulk (Admin only).
        /// </summary>
        /// <remarks>
        /// Requires admin authorization. Upload an Excel file with columns: Name, Email, RollNo (for Students), EmployeeId (for Faculty), Role, DepartmentId.
        /// Sample request:
        /// - Content-Type: multipart/form-data
        /// - File: [Excel file]
        /// </remarks>
        /// <param name="UploadedData">Excel file containing user data.</param>
        /// <returns>List of successful and failed uploads.</returns>
        /// <response code="200">File processed successfully, returns success and error lists.</response>
        /// <response code="400">Invalid or empty file.</response>
        /// <response code="401">Unauthorized access (non-admin user).</response>
        [HttpPost("/user/upload")]
        public async Task<IActionResult> UploadStudentOrFaculty([FromForm] UploadStudentorFacultyDTO UploadedData)
        {
            try
            {
                if (UploadedData.File == null || UploadedData.File.Length == 0)
                {
                    return BadRequest(new { message = "File is empty", success = false });
                }
                var result = await _userService.UploadStudentOrFaculty(UploadedData);
                return Ok(new { ErrorList = result.Errors, SuccessList = result.Successes, message = result.Message, success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }


        }



        /// <summary>
        /// Initiates user signup process (Step 1) by validating email and identifier.
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// ```json
        /// {
        ///   "email": "user@campus.com",
        /// }
        /// ```
        /// </remarks>
        /// <param name="signUpData">User signup data for step 1.</param>
        /// <returns>Signup result, including token for step 2.</returns>
        /// <response code="200">Signup step 1 successful.</response>
        /// <response code="500">Server error during signup step 1.</response>
        [HttpPost("signup/step1")]
        public async Task<ActionResult<SignUpResponseDTO>> SignUpStep1([FromBody] userSignUpStep1DTO signUpData)
        {
            try
            {
                var result = await _userService.SignUpStep1(signUpData);
                return Ok(result);
            }
            catch (Exception ex)
            {
                var response = new SignUpResponseDTO
                {
                    Success = false,
                    Message = "An error occurred during signup step 1.",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);   
            }
        }


        /// <summary>
        /// Completes user signup process (Step 2) by setting password and finalizing account.
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// ```json
        /// {
        ///     "Email": "example@gmail.com"
        ///   "otp": "000000",
        ///   "password": "password123"
        /// }
        /// ```
        /// </remarks>
        /// <param name="signUpData">User signup data for step 2.</param>
        /// <returns>Signup completion result.</returns>
        /// <response code="200">Signup step 2 successful.</response>
        /// <response code="500">Server error during signup step 2.</response>
        [HttpPost("signup/step2")]
        public async Task<ActionResult<SignUpResponseDTO>> SignUpStep2([FromBody] userSignUpStep2DTO signUpData)
        {
            try
            {
                var result = await _userService.SignUpStep2(signUpData);
                return Ok(result);
            }
            catch (Exception ex)
            {
                var response = new SignUpResponseDTO
                {
                    Success = false,
                    Message = "An error occurred during signup step 2.",
                    Errors = new List<string> { ex.Message }
                };
                return StatusCode(500, response);
            }
        }
    }

}

