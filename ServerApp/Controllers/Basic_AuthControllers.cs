using Microsoft.AspNetCore.Mvc;
using Basic_Auth.Model;
using Basic_Auth.Model.dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Basic_Auth.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;


        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Create User
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] Userdto user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = ModelState, success = false });
                }

                var result = await _userService.CreateUserAsync(user);
                Console.WriteLine(result);
                return Ok(new
                {
                    data = new
                    {
                        id = result.Id, Name = result.Name, Email = result.Email, Role = result.Role,
                        created_At = result.CreatedAt
                    },
                    message = "User Created Successfully!",
                    success = true
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message,
                    success = false,
                    data = (object)null
                });
            }

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
                        id = result.Id, Name = result.Name, Email = result.Email, created_At = result.CreatedAt
                    },
                    message = "User Updated Successfully!",
                    success = true
                });

            }
            catch (Exception ex)
            {
                return NotFound(new { data = (object)null, message = "User not found!", success= false });
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

        [HttpPost("/auth/login")]
        public async Task<IActionResult> LoginUser([FromBody] Logindto logindata)
        {
            try
            {
                var result = await _userService.LoginService(logindata);
                return Ok(new
                {
                    data = new
                    {
                        id = result.user.Id, Name = result.user.Name, Email = result.user.Email,
                        created_At = result.user.CreatedAt, Role = result.user.Role
                    },
                    accessToken = result.jwt, message = "Logged in Successfully", success = true
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message, success = false, data = (object)null });
            }
            catch (Exception ex)
            {
                return BadRequest( new { message = ex.Message, success = false, data = (object)null });
            }
        }


    }
}
