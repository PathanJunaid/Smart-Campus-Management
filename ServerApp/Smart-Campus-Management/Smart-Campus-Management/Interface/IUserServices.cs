using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

using Smart_Campus_Management.Helpers;

namespace Smart_Campus_Management.Interface
{
    public interface IUserServices
    {
        Task<ServiceResponse<string>> DeleteUserAsync(Guid id);
        Task<ServiceResponse<string>> RevokeUserAsync(Guid id);
        Task<User?> FindUserAsync(Guid id);
        Task<User?> FindUserByEmailAsync(string email);
        bool VerifyPassword(string enteredPassword, string storedHashedPassword);
        Task<LoginResponseDTO> LoginService(Logindto logindata);
        Task<UploadResponseDTO> UploadStudentOrFaculty(UploadStudentorFacultyDTO UploadedData);
        Task<SignUpResponseDTO> SignUpStep1(userSignUpStep1DTO signUpData);
        Task<SignUpResponseDTO> SignUpStep2(userSignUpStep2DTO signUpData);
        Task<ServiceResponse<User>> AddUser(Userdto userDto);
        Task<ServiceResponse<string>> UpdateEmail(UpdateEmailDto updateEmailDto);
        Task<ServiceResponse<User>> UpdateUserAsync(UpdateUserDto updateUserDto, UserRole requesterRole);
        Task<ServiceResponse<PaginatedList<User>>> GetAllUsersAsync(string? search, UserRole? role, bool? isActive = true, int pageNumber = 1, int pageSize = 30);
    }
}
