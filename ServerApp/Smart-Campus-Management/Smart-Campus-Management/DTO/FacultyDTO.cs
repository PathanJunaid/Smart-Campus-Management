using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.DTO
{
    public class FacultyDTO
    {
    }
    public class FacultyDto
    {
        [Required(ErrorMessage = "Faculty name is required.")]
        [MaxLength(100, ErrorMessage = "Faculty name cannot exceed 100 characters.")]
        public string FacultyName { get; set; }

        [MaxLength(250, ErrorMessage = "Description too long.")]
        public string? FacultyDescription { get; set; }
    }
}
