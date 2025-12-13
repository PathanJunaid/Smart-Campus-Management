using Smart_Campus_Management.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.DTO
{
    public class UploadStudentorFacultyDTO
    {
        public UserRole Role { get; set; }
        public IFormFile File { get; set; }
        public int? DepartmentId { get; set; }
    }
    public class UploadResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new List<string>();
        public List<string> Successes { get; set; } = new List<string>();
    }

    public class userSignUpStep1DTO {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "invalid email format.")]
        public string Email { get; set; }
        public bool IsForgetPassword { get; set; } = false;
    }
    public class userSignUpStep2DTO : userSignUpStep1DTO {
        [Required(ErrorMessage = "password is required.")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "password must be between 8 to 20 letters.")]
        public string Password { get; set; }
        [Required(ErrorMessage = "OTP is Reqiured")]
        [Range(100000, 999999, ErrorMessage = "OTP must be exactly 6 digits.")]
        public int OTP { get; set; }
        public bool IsForgetPassword { get; set; } = false;
    }
    public class SignUpResponseDTO { 
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
        public List<string> Errors { get; set; } = new List<string>(); 
    }

    public class Userdto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First Name must be between 3 to 50 letters.")]
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public Int64? RollNo { get; set; } // If student

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email format")]
        public string Email { get; set; }
        [RegularExpression(@"^[1-9][0-9]{9}$", ErrorMessage = "Mobile number must be 10 digits and cannot start with 0.")]
        public long? MobileNumber { get; set; }
        public UserRole Role { get; set; } = UserRole.Student;

    }
    public class Logindto
    {

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "password is required.")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "password must be between 8 to 20 letters.")]
        public string Password { get; set; }
    }
    public class LoginResponseDTO { 
        public bool Success { get; set; } 
        public string Message { get; set; } = string.Empty; 
        public List<string> Errors { get; set; } = new List<string>(); 
        public User? User { get; set; } 
        public string? Jwt { get; set; } 
        public bool NeedsRegistration { get; set; } 
    }
    public class Namedto
    {
        public string Name { get; set; }
    }

    public class TokenDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
    }

    public class UpdateEmailDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }
    }

    public class UpdateUserDto
    {
        [Required]
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public UserRole Role { get; set; }
        public long? MobileNumber { get; set; }
        public DateOnly? DOB { get; set; }
    }
    public class UserResponseDTO
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public long? RollNo { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserRole Role { get; set; }
        public DateOnly? DOB { get; set; }
        public long? MobileNumber { get; set; }
        public string? ProfilePicture { get; set; }
        public bool Active { get; set; }
        public int DepartmentId { get; set; }
        public int FacultyId { get; set; }
    }

}