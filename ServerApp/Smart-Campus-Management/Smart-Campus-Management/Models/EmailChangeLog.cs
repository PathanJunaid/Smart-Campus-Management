using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Campus_Management.Models
{
    public class EmailChangeLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [EmailAddress]
        public string OldEmail { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string NewEmail { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        public string? ChangedBy { get; set; } // Optional: to track who made the change (e.g., "Self", "Admin")
    }
}
