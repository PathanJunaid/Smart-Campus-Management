using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Interface
{
    public interface IDepartmentServices
    {
        Task<Department_Model> AddDepartment(CreateDepartmentDTO model);
        Task<Department_Model?> GetDepartmentById(int id);
        Task<List<Department_Model>> GetAllDepartments();
        Task<Department_Model?> UpdateDepartment(int id, Department_Model model);
        Task<bool> DeleteDepartment(int id);
    }
}
