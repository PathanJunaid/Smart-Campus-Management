using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.DTO
{
    public class CreateDepartmentDTO
    {
        [Required(ErrorMessage = "Department name is required.")]
        [StringLength(100, ErrorMessage = "Department name can't exceed 100 characters.")]
        public string DepartmentName { get; set; }

        [StringLength(200, ErrorMessage = "Description too long.")]
        public string? DepartmentDescription { get; set; }

        [Required(ErrorMessage = "FacultyId is required.")]
        public int FacultyId { get; set; }
    }
    public class UpdateDepartmentDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "Department name can't exceed 100 characters.")]
        public string DepartmentName { get; set; }
        [StringLength(200)]
        public string? DepartmentDescription { get; set; }
        public int AcademicYear { get; set; }
        public bool DepartmentStatus { get; set; } = true;
        public int FacultyId { get; set; } 
    }
}
