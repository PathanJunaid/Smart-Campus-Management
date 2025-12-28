using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Interface
{
    public interface IProfessorEnrollmentServices
    {
        Task<ServiceResponse<ProfessorEnrollmentResponseDTO>> AddEnrollment(AddProfessorEnrollmentDTO request);
        Task<ServiceResponse<ProfessorEnrollmentResponseDTO>> UpdateEnrollment(UpdateProfessorEnrollmentDTO request);
        Task<ServiceResponse<bool>> DeleteEnrollment(int id);
        Task<ServiceResponse<List<ProfessorEnrollmentResponseDTO>>> GetAllEnrollments();
    }
}
