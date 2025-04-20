using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Basic_Auth.Model;
using Basic_Auth.Model.dto;
using Basic_Auth.Model.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Basic_Auth.Services
{
    public class UserServices : IUserService
    {
        private readonly AppDbContext dbcontext;
        private readonly IConfiguration _Config;

        public UserServices(AppDbContext dbcontext, IConfiguration config)
        {
            this.dbcontext = dbcontext;
            this._Config = config;
        }

        public async Task<User> CreateUserAsync(Userdto user)
        {
            try
            {
                var existingUser = await FindUserByEmailAsync(user.Email.ToLower());
                if (existingUser != null)
                {
                    throw new Exception("User Already Exist!");
                }
                user.Password = HashPassword(user.Password);
                User userdata = new()
                {
                    Name = user.Name,
                    Email = user.Email.ToLower(),
                    Password = user.Password,
                    Role = Enum.TryParse(typeof(UserRole), user.Role, out var parsedRole) ? (UserRole)parsedRole : UserRole.Student,
                };

                await dbcontext.Users.AddAsync(userdata);
                await dbcontext.SaveChangesAsync();
                return userdata;
            }
            catch (Exception ex)
            {
                throw new Exception("Registration failed!", ex);
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
                user.Name = Name;
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


        public async Task<(User user, string jwt)> LoginService(Logindto logindata)
        {
            try
            {
                var result = await FindUserByEmailAsync(logindata.Email);
                if (result == null)
                {
                    throw new Exception("User not found!");
                }

                var IsPasswordMatched = VerifyPassword(logindata.Password, result.Password);
                if (!IsPasswordMatched)
                {
                    throw new UnauthorizedAccessException("Wrong password!");
                }

                var TokenData = new TokenDto
                {
                    Id = result.Id,
                    Name = result.Name,
                    Email = result.Email,
                    Role = result.Role,
                };
                var jwt = GenerateJwtToken(TokenData);
                
                return (result, jwt);

            }
            catch (Exception ex)
            {
                throw new Exception("Login failed!", ex);
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
        
        private string GenerateJwtToken(TokenDto TokenData)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, TokenData.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, TokenData.Email),
                new Claim(ClaimTypes.Role, TokenData.Role.ToString()),
                new Claim("userId", TokenData.Id.ToString()),
            };
            Console.WriteLine(_Config["Jwt:ValidIssuer"]);
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
        private  TokenDto DecodeJwtToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Extract claims
            var Id = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            var Name = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
            var Email = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
            var Role = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            return  new TokenDto{Id=Id != null ? Guid.Parse(Id) : Guid.Empty, Name =Name, Email = Email,Role = Enum.TryParse(typeof(UserRole), Role, out var parsedRole) ? (UserRole)parsedRole : UserRole.Student};

        }

    }
}
