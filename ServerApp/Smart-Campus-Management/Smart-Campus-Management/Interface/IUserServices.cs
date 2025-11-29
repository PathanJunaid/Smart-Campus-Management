using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Interface
{
    public interface IUserServices
    {
        Task<string> DeleteUserAsync(Guid id);
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
    }
}
