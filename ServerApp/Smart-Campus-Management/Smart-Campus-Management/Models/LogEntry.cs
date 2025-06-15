using System;
using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.Models
{
    public class LogEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Action { get; set; } // e.g., "UserImport"

        [Required]
        public string Status { get; set; } // e.g., "Success", "Failure"

        public string Details { get; set; } // e.g., "User added successfully" or error message

        public string Data { get; set; } // e.g., JSON or string representation of user data

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}