
using Basic_Auth.Model.Entities;
using System.ComponentModel.DataAnnotations;

namespace Basic_Auth.Model.dto
{
    public class Userdto
    {
        [Required(ErrorMessage = "name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "name must be between 3 to 50 letters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "password is required.")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "Password length must be between 8 to 20 letters.")]
        public string Password { get; set; }
        public string Role { get; set; } = "User";

    }
    public class Logindto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "password is required.")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "password must be between 8 to 20 letters.")]
        public string Password { get; set; }
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
}
