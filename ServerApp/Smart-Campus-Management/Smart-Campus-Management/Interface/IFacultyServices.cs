using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.Helpers;

namespace Smart_Campus_Management.Interface
{
    public interface IFacultyServices
    {
        Task<Faculty_Model?> AddFacultyAsync(FacultyDto facultyDto);
        Task<Faculty_Model?> UpdateFacultyAsync(int id, FacultyDto facultyDto);
        Task<bool> DeleteFacultyAsync(int id);
        Task<Faculty_Model?> GetFacultyByIdAsync(int id);
        Task<ServiceResponse<PaginatedList<Faculty_Model>>> GetAllFacultiesAsync(string? search, int pageNumber = 1, int pageSize = 15);
    }
}
