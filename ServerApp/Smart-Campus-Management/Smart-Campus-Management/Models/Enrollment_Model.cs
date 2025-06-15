﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Campus_Management.Models
{
    public enum EnrollmentStatus
    {
        Active,
        Completed,
        Dropped
    }
    public class Enrollment_Model
    {
        [Key]
        public int Id { get; set; }
        public Guid StudentId { get; set; }
        public EnrollmentStatus EnrollmentStatus { get; set; } = EnrollmentStatus.Active;
        public int DepartmentId { get; set; }
        [ForeignKey("DepartmentId")]
        public Department_Model Departments { get; set; }
        [ForeignKey("StudentId")]
        public User User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
