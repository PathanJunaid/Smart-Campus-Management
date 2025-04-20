using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Basic_Auth.Model.Entities
{
    public enum UserRole
    {
        Admin,
        Faculty,
        Student,
    }

    public class User
    {
        [Key]
        [Required]
        public Guid Id { get; set; }= Guid.NewGuid();
        [Required]
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public bool Active { get; set; } = true;
        [Required]
        public UserRole Role { get; set; }
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Created once
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
    }

}
