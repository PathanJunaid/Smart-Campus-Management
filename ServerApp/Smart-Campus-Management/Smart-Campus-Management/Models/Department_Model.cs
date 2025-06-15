using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Campus_Management.Models
{
    public class Department_Model
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Department name is required.")]
        [StringLength(100, ErrorMessage = "Department name can't exceed 100 characters.")]
        public string DepartmentName { get; set; }
        public string DepartmentDescription { get; set; } = string.Empty;
        public bool DepartmentStatus { get; set;} = true;
        public int AcademicYear { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        [ForeignKey("Faculty")]
        public int FacultyId { get; set; }
        public Faculty_Model Faculty { get; set; }
        public ICollection<Enrollment_Model> Enrollments { get; set; }
    }
}
