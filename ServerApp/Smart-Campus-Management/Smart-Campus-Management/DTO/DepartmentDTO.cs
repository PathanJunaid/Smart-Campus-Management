using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.DTO
{
    public class CreateDepartmentDTO
    {
        [Required(ErrorMessage = "Department name is required.")]
        [StringLength(50, ErrorMessage = "Department name cannot exceed 50 characters.")]
        public string DepartmentName { get; set; }
        [StringLength(200, ErrorMessage = "Department description cannot exceed 200 characters.")]
        public string? DepartmentDescription { get; set; }

    }
}
