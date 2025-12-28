using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.Helpers;

namespace Smart_Campus_Management.Interface
{
    public interface IEnrollmentServices
    {
        Task<ServiceResponse<Enrollment_Model>> AddEnrollment(AddEnrollmentDTO Enroll);
        Task<ServiceResponse<bool>> UpdateEnrollment(UpdateEnrollmentDTO Enroll);
        Task<ServiceResponse<List<Enrollment_Model>>> EnrollUsers(EnrollUserRequestDto request);
        Task<bool> AlreadyEnrolled(string Email, DateTime EffectiveFrom, int DepartmentId);
        Task<ServiceResponse<PaginatedEnrollmentResponse>> GetEnrollments(GetEnrolledUsersFilterDto filter);
        Task<ServiceResponse<List<UserResponseDTO>>> GetUnenrolledStudents();
        Task<ServiceResponse<bool>> DeleteEnrollment(int id);

    }
}
