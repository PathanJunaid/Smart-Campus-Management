using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.Helpers;

namespace Smart_Campus_Management.Services
{
    public class FacultyServices : IFacultyServices
    {
        private readonly AppDbContext _context;
        private readonly ILogServices _logService;

        public FacultyServices(AppDbContext context, ILogServices logService)
        {
            _context = context;
            _logService = logService;
        }

        // Add Faculty
        public async Task<Faculty_Model?> AddFacultyAsync(FacultyDto dto)
        {
            try
            {
                var faculty = new Faculty_Model
                {
                    FacultyName = dto.FacultyName,
                    FacultyDescription = dto.FacultyDescription,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Faculty.AddAsync(faculty);
                await _context.SaveChangesAsync();

                await _logService.LogToDatabase("AddFaculty", "Success", "Faculty added", $"{{ \"Name\": \"{faculty.FacultyName}\" }}");
                return faculty;
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("AddFaculty", "Error", ex.Message, "{}");
                return null;
            }
        }

        // Update Faculty
        public async Task<Faculty_Model?> UpdateFacultyAsync(int id, FacultyDto dto)
        {
            try
            {
                var faculty = await _context.Faculty.FindAsync(id);
                if (faculty == null)
                {
                    await _logService.LogToDatabase("UpdateFaculty", "Failed", "Faculty not found", $"{{ \"Id\": {id} }}");
                    return null;
                }

                faculty.FacultyName = dto.FacultyName;
                faculty.FacultyDescription = dto.FacultyDescription;

                _context.Faculty.Update(faculty);
                await _context.SaveChangesAsync();

                await _logService.LogToDatabase("UpdateFaculty", "Success", "Faculty updated", $"{{ \"Id\": {id} }}");
                return faculty;
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("UpdateFaculty", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return null;
            }
        }

        // Soft Delete Faculty
        public async Task<bool> DeleteFacultyAsync(int id)
        {
            try
            {
                var faculty = await _context.Faculty.FindAsync(id);
                if (faculty == null)
                {
                    await _logService.LogToDatabase("DeleteFaculty", "Failed", "Faculty not found", $"{{ \"Id\": {id} }}");
                    return false;
                }

                faculty.IsActive = false;
                _context.Faculty.Update(faculty);
                await _context.SaveChangesAsync();

                await _logService.LogToDatabase("DeleteFaculty", "Success", "Faculty deactivated", $"{{ \"Id\": {id} }}");
                return true;
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("DeleteFaculty", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return false;
            }
        }

        // Get Faculty by Id
        public async Task<Faculty_Model?> GetFacultyByIdAsync(int id)
        {
            try
            {
                var faculty = await _context.Faculty.FirstOrDefaultAsync(f => f.Id == id && f.IsActive);
                return faculty;
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("GetFacultyById", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return null;
            }
        }

        // Get All Active Faculty
        // Get All Active Faculty
        public async Task<ServiceResponse<PaginatedList<Faculty_Model>>> GetAllFacultiesAsync(string? search, int pageNumber = 1, int pageSize = 15)
        {
            var response = new ServiceResponse<PaginatedList<Faculty_Model>>();
            try
            {
                var query = _context.Faculty.Include(f => f.Departments).Where(f => f.IsActive).AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    var terms = search.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                    foreach (var term in terms)
                    {
                        query = query.Where(f => f.FacultyName.ToLower().Contains(term) || (f.FacultyDescription != null && f.FacultyDescription.ToLower().Contains(term)));
                    }
                }

                var paginatedFaculties = await PaginatedList<Faculty_Model>.CreateAsync(query, pageNumber, pageSize);
                
                response.Success = true;
                response.Message = "Faculties retrieved successfully.";
                response.data = paginatedFaculties;
                return response;
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("GetAllFaculties", "Error", ex.Message, "{}");
                response.Success = false;
                response.Message = $"Failed to retrieve faculties: {ex.Message}";
                return response;
            }
        }
    }
}
