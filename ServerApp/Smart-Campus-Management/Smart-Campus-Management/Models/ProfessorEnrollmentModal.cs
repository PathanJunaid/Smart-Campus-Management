using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Campus_Management.Models
{
    public class ProfessorEnrollmentModal
    {
        [Display(Name = "Employee Id")]
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RemovedAt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department_Model Department { get; set; }

    }
}
