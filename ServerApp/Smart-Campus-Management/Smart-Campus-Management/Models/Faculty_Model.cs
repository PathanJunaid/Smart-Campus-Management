using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.Models
{
    public class Faculty_Model
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FacultyName { get; set; }
        public string? FacultyDescription { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
