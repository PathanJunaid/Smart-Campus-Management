using Smart_Campus_Management.Models;
using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.DTO
{
    public class AddProfessorEnrollmentDTO
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public int DepartmentId { get; set; }
    }

    public class UpdateProfessorEnrollmentDTO
    {
        [Required]
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProfessorEnrollmentResponseDTO
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int DepartmentId { get; set; }
        public string ProfessorName { get; set; }
        public string DepartmentName { get; set; }
        public DateTime AssignedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
