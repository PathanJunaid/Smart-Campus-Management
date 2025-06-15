using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Interface
{
    public interface IEnrollmentServices
    {
        Task<ServiceResponse<Enrollment_Model>> AddEnrollment(AddEnrollmentDTO Enroll);
        Task<bool> UpdateEnrollment(UpdateEnrollmentDTO Enroll);

    }
}
