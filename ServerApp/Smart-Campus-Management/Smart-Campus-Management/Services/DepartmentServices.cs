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
                    FacultyId = model.FacultyId,
                    AcademicYear = model.AcademicYear
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
                department.AcademicYear = model.AcademicYear;
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
        public async Task<List<EnrolledUserResponseDto>> GetEnrolledUsers(GetEnrolledUsersFilterDto filter)
        {
            try
            {
                var allUsers = new List<EnrolledUserResponseDto>();

                // 1. Fetch Students
                if (!filter.Role.HasValue || filter.Role == UserRole.Student)
                {
                    var studentQuery = _context.Enrollments
                        .Include(e => e.Student)
                        .Include(e => e.Departments)
                        .AsNoTracking()
                        .AsQueryable();

                    if (!string.IsNullOrEmpty(filter.Search))
                    {
                        string search = filter.Search.ToLower();
                        studentQuery = studentQuery.Where(e =>
                            (e.Student.FirstName != null && e.Student.FirstName.ToLower().Contains(search)) ||
                            (e.Student.LastName != null && e.Student.LastName.ToLower().Contains(search)) ||
                            (e.Student.Email != null && e.Student.Email.ToLower().Contains(search))
                        );
                    }

                    if (filter.EnrollmentYear.HasValue)
                    {
                        studentQuery = studentQuery.Where(e => e.EffectiveFrom.Year == filter.EnrollmentYear.Value);
                    }

                    var students = await studentQuery.Select(e => new EnrolledUserResponseDto
                    {
                        EnrollmentId = e.Id,
                        UserId = e.StudentId,
                        User = new UserResponseDTO
                        {
                            Id = e.Student.Id,
                            FirstName = e.Student.FirstName,
                            MiddleName = e.Student.MiddleName,
                            LastName = e.Student.LastName ?? string.Empty,
                            Email = e.Student.Email,
                            Role = e.Student.Role,
                            RollNo = e.Student.RollNo,
                            MobileNumber = e.Student.MobileNumber,
                            DOB = e.Student.DOB,
                            ProfilePicture = e.Student.ProfilePicture,
                            Active = e.Student.Active,
                            CreatedAt = e.Student.CreatedAt,
                            DepartmentId = e.DepartmentId,
                            FacultyId = e.Departments.FacultyId
                        }
                    }).ToListAsync();

                    allUsers.AddRange(students);
                }

                // 2. Fetch Professors
                if (!filter.Role.HasValue || filter.Role == UserRole.Professor)
                {
                    var profQuery = _context.ProfessorEnrollments
                        .Include(e => e.User)
                        .Include(e => e.Department)
                        .AsNoTracking()
                        .AsQueryable();

                    if (!string.IsNullOrEmpty(filter.Search))
                    {
                        string search = filter.Search.ToLower();
                        profQuery = profQuery.Where(e =>
                            (e.User.FirstName != null && e.User.FirstName.ToLower().Contains(search)) ||
                            (e.User.LastName != null && e.User.LastName.ToLower().Contains(search)) ||
                            (e.User.Email != null && e.User.Email.ToLower().Contains(search))
                        );
                    }

                    if (filter.EnrollmentYear.HasValue)
                    {
                        profQuery = profQuery.Where(e => e.AssignedAt.Year == filter.EnrollmentYear.Value);
                    }

                    var professors = await profQuery.Select(e => new EnrolledUserResponseDto
                    {
                        EnrollmentId = e.Id,
                        UserId = e.UserId,
                        User = new UserResponseDTO
                        {
                            Id = e.User.Id,
                            FirstName = e.User.FirstName,
                            MiddleName = e.User.MiddleName,
                            LastName = e.User.LastName ?? string.Empty,
                            Email = e.User.Email,
                            Role = e.User.Role,
                            RollNo = e.User.RollNo,
                            MobileNumber = e.User.MobileNumber,
                            DOB = e.User.DOB,
                            ProfilePicture = e.User.ProfilePicture,
                            Active = e.User.Active,
                            CreatedAt = e.User.CreatedAt,
                            DepartmentId = e.DepartmentId,
                            FacultyId = e.Department.FacultyId
                        }
                    }).ToListAsync();

                    allUsers.AddRange(professors);
                }

                await _logServices.LogToDatabase("GetEnrolledUsers", "Success", $"Fetched {allUsers.Count} users", JsonSerializer.Serialize(filter));

                return allUsers;
            }
            catch (Exception ex)
            {
                await _logServices.LogToDatabase("GetEnrolledUsers", "Error", ex.Message, JsonSerializer.Serialize(filter));
                return new List<EnrolledUserResponseDto>();
            }
        }
    }
}
