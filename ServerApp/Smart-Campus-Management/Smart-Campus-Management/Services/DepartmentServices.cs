using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
using System.Text.Json;

namespace Smart_Campus_Management.Services
{
    public class DepartmentServices : IDepartmentServices
    {
        private readonly AppDbContext _context;
        private readonly ILogServices _logServices;

        public DepartmentServices(AppDbContext context, ILogServices logServices)
        {
            _context = context;
            _logServices = logServices;
        }

        public async Task<Department_Model?> CreateDepartment(CreateDepartmentDTO model)
        {
            try
            {
                // Optional: check if Faculty exists
                var facultyExists = await _context.Faculty.AnyAsync(f => f.Id == model.FacultyId);
                if (!facultyExists)
                {
                    throw new Exception("Faculty not found");
                }

                var department = new Department_Model
                {
                    DepartmentName = model.DepartmentName,
                    DepartmentDescription = model.DepartmentDescription ?? "",
                    DepartmentStatus = true,
                    CreatedAt = DateTime.UtcNow,
                    FacultyId = model.FacultyId
                };

                await _context.Departments.AddAsync(department);
                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("CreateDepartment", "Success", "Department Created", JsonSerializer.Serialize(department));
                return department;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("CreateDepartment", "Error", ex.Message, JsonSerializer.Serialize(model));
                return null;
            }
        }

        public async Task<List<Department_Model>> GetAllDepartments()
        {
            try
            {
                return await _context.Departments
                    .Include(d => d.Faculty)
                    .Where(d => d.DepartmentStatus)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("GetAllDepartments", "Error", ex.Message, "{}");
                return new List<Department_Model>();
            }
        }

        public async Task<Department_Model?> GetDepartmentById(int id)
        {
            try
            {
                return await _context.Departments
                    .Include(d => d.Faculty)
                    .FirstOrDefaultAsync(d => d.Id == id && d.DepartmentStatus);
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("GetDepartmentById", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return null;
            }
        }

        public async Task<Department_Model?> UpdateDepartment(int id, UpdateDepartmentDTO model)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    await _logServices.LogToDatabase("UpdateDepartment", "Failed", "Department not found", $"{{ \"Id\": {id} }}");
                    return null;
                }

                department.DepartmentName = model.DepartmentName;
                department.DepartmentDescription = model.DepartmentDescription ?? "";
                department.DepartmentStatus = model.DepartmentStatus;
                department.FacultyId = model.FacultyId;
                department.UpdatedAt = DateTime.UtcNow;

                _context.Departments.Update(department);
                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("UpdateDepartment", "Success", "Department Updated", JsonSerializer.Serialize(department));
                return department;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("UpdateDepartment", "Error", ex.Message, JsonSerializer.Serialize(model));
                return null;
            }
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    await _logServices.LogToDatabase("DeleteDepartment", "Failed", "Department not found", $"{{ \"Id\": {id} }}");
                    return false;
                }

                department.DepartmentStatus = false;
                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("DeleteDepartment", "Success", "Department deactivated", $"{{ \"Id\": {id} }}");
                return true;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("DeleteDepartment", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return false;
            }
        }
    }
}
