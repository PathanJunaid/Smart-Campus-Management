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

        public async Task<Department_Model> AddDepartment(CreateDepartmentDTO model)
        {
            try
            {
                Department_Model department = new Department_Model
                {
                    DepartmentName = model.DepartmentName,
                    DepartmentDescription = model.DepartmentDescription
                };
                department.CreatedAt = DateTime.UtcNow;
                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("Department", "Success", $"Department '{model.DepartmentName}' created.", JsonSerializer.Serialize(model));
                return department;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("Create", "Error", $"Error creating department: {ex.Message}", JsonSerializer.Serialize(model));
                throw;
            }
        }

        public async Task<Department_Model?> GetDepartmentById(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                return department;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("GetById", "Error", $"Error fetching department ID {id}: {ex.Message}", "{}");
                throw;
            }
        }

        public async Task<List<Department_Model>> GetAllDepartments()
        {
            try
            {
                var departments = await _context.Departments.Where(d=> d.DepartmentStatus == true).ToListAsync();

                return departments;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("GetAll", "Error", $"Error fetching all departments: {ex.Message}", "{}");
                throw;
            }
        }

        public async Task<Department_Model?> UpdateDepartment(int id, Department_Model model)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    await _logServices.LogToDatabase("Update", "Error", $"Department with ID {id} not found.", "{}");
                    return null;
                }

                department.DepartmentName = model.DepartmentName;
                department.DepartmentDescription = model.DepartmentDescription;
                department.DepartmentStatus = model.DepartmentStatus;

                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("Update", "Success", $"Updated department with ID: {id}", JsonSerializer.Serialize(department));
                return department;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("Update", "Error", $"Error updating department ID {id}: {ex.Message}", JsonSerializer.Serialize(model));
                throw;
            }
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    await _logServices.LogToDatabase("Delete", "Error", $"Department with ID {id} not found.", "{}");
                    return false;
                }
                department.DepartmentStatus = false;
                await _context.SaveChangesAsync();

                await _logServices.LogToDatabase("Delete", "Success", $"Deleted department with ID: {id}", JsonSerializer.Serialize(department));
                return true;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("Delete", "Error", $"Error deleting department ID {id}: {ex.Message}", "{}");
                throw;
            }
        }
    }
}
