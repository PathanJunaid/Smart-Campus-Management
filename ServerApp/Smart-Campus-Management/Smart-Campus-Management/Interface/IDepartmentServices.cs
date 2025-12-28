using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Interface
{
    public interface IDepartmentServices
    {
        Task<Department_Model?> CreateDepartment(CreateDepartmentDTO model);
        Task<List<Department_Model>> GetAllDepartments();
        Task<Department_Model?> GetDepartmentById(int id);
        Task<Department_Model?> UpdateDepartment(int id, UpdateDepartmentDTO model);
        Task<bool> DeleteDepartment(int id);
        Task<List<EnrolledUserResponseDto>> GetEnrolledUsers(GetEnrolledUsersFilterDto filter);
    }
}
