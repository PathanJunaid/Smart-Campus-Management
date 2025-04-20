using Basic_Auth.Model.dto;
using Basic_Auth.Model.Entities;

namespace Basic_Auth.Model
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(Userdto user);
        Task<User> UpdateUserAsync(Guid id, string User);
        Task<string> DeleteUserAsync(Guid id);
        Task<User?> FindUserAsync(Guid id);
        Task<User?> FindUserByEmailAsync(string email);
        bool VerifyPassword(string enteredPassword, string storedHashedPassword);
        Task<(User user, string jwt)> LoginService(Logindto logindata);
    }
    

}
