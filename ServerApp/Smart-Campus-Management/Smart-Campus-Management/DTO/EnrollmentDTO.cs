using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.DTO
{
    public class EnrollmentDTO
    {
    }
    public class AddEnrollmentDTO
    {
        public Guid StudentId { get; set; }
        public int DepartmentId { get; set; }
    }

    public class UpdateEnrollmentDTO : AddEnrollmentDTO
    {
        public EnrollmentStatus EnrollmentStatus { get; set; }
        public int Id { get; set; }
    }
    


}
