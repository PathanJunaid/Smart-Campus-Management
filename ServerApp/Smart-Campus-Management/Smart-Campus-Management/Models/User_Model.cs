using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.Models
{
        public enum UserRole
        {
            Admin,
            Faculty,
            Student
        }
        public enum Departments
        {
            Engineering,
            Arts,
        }

        public class User
        {
            [Key]
            [Required]
            public Guid Id { get; set; } = Guid.NewGuid();
            public Int64? RollNo { get; set; } // If student
            public int? EmployeeId { get; set; } // If Faculty
            [Required]
            public string FirstName { get; set; }
            public string? MiddleName { get; set; }
            public string? LastName { get; set; }

            [Required, EmailAddress]
            public string Email { get; set; }
            public string? Password { get; set; } = null;
            public bool Active { get; set; } = true;
            public UserRole Role { get; set; }
            public string? ProfilePicture { get; set; } = null;
            public Int64? MobileNumber { get; set; }
            public DateOnly? DOB { get; set; }
            [Required]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Created once
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
            
            public Departments? Department { get; set; }
            public ICollection<Enrollment_Model> Enrollments { get; set; }

    }
    }

