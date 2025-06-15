using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.Models
{
    public class Department_Model
    {
        [Key]
        public int Id { get; set; }

        required
        public string DepartmentName { get; set; }

        public string DepartmentDescription { get; set; } = string.Empty;
        public bool DepartmentStatus { get; set;} = true;
        public DateTime CreatedAt { get; set; }
    }
}
