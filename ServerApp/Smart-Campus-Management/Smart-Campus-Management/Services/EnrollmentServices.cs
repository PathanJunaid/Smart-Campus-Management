using Amazon.Runtime.Internal;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Enums;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.Helpers;
using System.Text.Json;

namespace Smart_Campus_Management.Services
{
    public class EnrollmentServices : IEnrollmentServices
    {
        private readonly AppDbContext _context;
        private readonly ILogServices _logger;

        public EnrollmentServices(AppDbContext context, ILogServices logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ServiceResponse<Enrollment_Model>> AddEnrollment(AddEnrollmentDTO Enroll)
        {
            ServiceResponse<Enrollment_Model> response = new ServiceResponse<Enrollment_Model>();
            try
            {
                var isEnrolled = await _context.Enrollments.Include(e => e.Departments).FirstOrDefaultAsync(e => e.StudentId == Enroll.StudentId && e.DepartmentId == Enroll.DepartmentId);
                if (isEnrolled != null)
                {
                    bool isStillEnrolled = DateTime.UtcNow.Year - isEnrolled.CreatedAt.Year < isEnrolled.Departments.AcademicYear;
                    if (isEnrolled.EnrollmentStatus == EnrollmentStatus.Active && isStillEnrolled)
                    {
                        response.Success = false;
                        response.Message = $"Student Already Enrolled EnrollmentId = ${isEnrolled.Id}";
                        response.data = isEnrolled;
                        return response;
                    }

                }
                Enrollment_Model Enrollment = new Enrollment_Model
                {
                    StudentId = Enroll.StudentId,
                    DepartmentId = Enroll.DepartmentId,
                    EffectiveFrom = Enroll.EffectiveFrom,
                    EffectiveTo = Enroll.EffectiveFrom.AddYears(isEnrolled?.Departments?.AcademicYear ?? (await _context.Departments.FindAsync(Enroll.DepartmentId)).AcademicYear),
                    EnrollmentStatus = EnrollmentStatus.Active,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                int year = Enroll.EffectiveFrom.Year;
                int currentCount = await _context.Enrollments.CountAsync(e => e.EffectiveFrom.Year == year);
                currentCount++;
                var rollNoStr = $"{year}{currentCount:D6}";
                int rollNo = int.Parse(rollNoStr);
                Enrollment.RollNo = rollNo;
                var result = await _context.Enrollments.AddAsync(Enrollment);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = $"Student Enrolled successfully";
                response.data = isEnrolled;
                return response;
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("Enrollment", ErrorName.Failure.ToString(), ex.Message, JsonSerializer.Serialize(Enroll));
                response.Success = false;
                response.Message = $"failed to enroll student ${Enroll.StudentId}";
                response.data = null;
                return response;
            }


        }
        public async Task<ServiceResponse<bool>> UpdateEnrollment(UpdateEnrollmentDTO Enroll)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var Enrollment = await _context.Enrollments
                    .Include(e => e.Departments)
                    .FirstOrDefaultAsync(e => e.Id == Enroll.Id);
                
                if (Enrollment == null)
                {
                    response.Success = false;
                    response.Message = "Enrollment not found!";
                    return response;
                }

                // If Department or EffectiveFrom changes, recalculate EffectiveTo
                if (Enrollment.DepartmentId != Enroll.DepartmentId || Enrollment.EffectiveFrom != Enroll.EffectiveFrom)
                {
                    var department = await _context.Departments.FindAsync(Enroll.DepartmentId);
                    if (department == null)
                    {
                        response.Success = false;
                        response.Message = "Department not found!";
                        return response;
                    }
                    Enrollment.DepartmentId = Enroll.DepartmentId;
                    Enrollment.EffectiveFrom = Enroll.EffectiveFrom;
                    Enrollment.EffectiveTo = Enroll.EffectiveFrom.AddYears(department.AcademicYear);
                }

                Enrollment.StudentId = Enroll.StudentId;
                Enrollment.EnrollmentStatus = Enroll.EnrollmentStatus;
                Enrollment.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                await _logger.LogToDatabase("Enrollment", ErrorName.Success.ToString(), $"Enrollment with {Enroll.Id} successfully updated!", JsonSerializer.Serialize(Enroll));
                
                response.Success = true;
                response.Message = "Enrollment updated successfully";
                response.data = true;
                return response;
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("Enrollment", ErrorName.Failure.ToString(), ex.Message, JsonSerializer.Serialize(Enroll));
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<bool>> DeleteEnrollment(int id)
        {
            var response = new ServiceResponse<bool>();
            try 
            {
                var enrollment = await _context.Enrollments.FindAsync(id);
                if (enrollment == null)
                {
                    response.Success = false;
                    response.Message = "Enrollment not found";
                    return response;
                }

                enrollment.EnrollmentStatus = EnrollmentStatus.Dropped; // Soft Delete
                enrollment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Enrollment deleted successfully";
                response.data = true;
                return response;
            }
            catch(Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<PaginatedEnrollmentResponse>> GetEnrollments(GetEnrolledUsersFilterDto filter)
        {
            var response = new ServiceResponse<PaginatedEnrollmentResponse>();
            try
            {
                var query = _context.Enrollments
                    .Include(e => e.Student)
                    .Include(e => e.Departments)
                    .ThenInclude(d => d.Faculty)
                    .AsQueryable();

                // Filters
                if (!string.IsNullOrEmpty(filter.Search))
                {
                    string search = filter.Search.ToLower();
                    query = query.Where(e => 
                        e.Student.FirstName.ToLower().Contains(search) || 
                        e.Student.LastName.ToLower().Contains(search) ||
                        e.Student.Email.ToLower().Contains(search));
                }

                if (filter.FacultyId.HasValue)
                {
                    query = query.Where(e => e.Departments.Faculty.Id == filter.FacultyId.Value);
                }

                if (filter.DepartmentId.HasValue)
                {
                    query = query.Where(e => e.DepartmentId == filter.DepartmentId.Value);
                }

                if (filter.EnrollmentYear.HasValue)
                {
                    query = query.Where(e => e.EffectiveFrom.Year == filter.EnrollmentYear.Value);
                }

                if (filter.Status.HasValue)
                {
                    query = query.Where(e => e.EnrollmentStatus == filter.Status.Value);
                }

                // Sorting
                query = query.OrderByDescending(e => e.CreatedAt);

                // Pagination
                var count = await query.CountAsync();
                var items = await query
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .Select(e => new EnrollmentListItemDto
                    {
                        Id = e.Id,
                        StudentId = e.StudentId,
                        StudentName = (e.Student.FirstName + " " + (e.Student.MiddleName ?? "") + " " + e.Student.LastName).Trim(),
                        Email = e.Student.Email,
                        DepartmentId = e.DepartmentId,
                        DepartmentName = e.Departments.DepartmentName,
                        FacultyId = e.Departments.Faculty.Id,
                        FacultyName = e.Departments.Faculty.FacultyName,
                        EffectiveFrom = e.EffectiveFrom,
                        EffectiveTo = e.EffectiveTo,
                        Status = e.EnrollmentStatus
                    })
                    .ToListAsync();

                // Create wrapped response
                var paginatedData = new PaginatedEnrollmentResponse
                {
                    Items = items,
                    TotalCount = count,
                    PageIndex = filter.PageNumber,
                    PageSize = filter.PageSize,
                    TotalPages = (int)Math.Ceiling(count / (double)filter.PageSize),
                    HasNextPage = filter.PageNumber < (int)Math.Ceiling(count / (double)filter.PageSize),
                    HasPreviousPage = filter.PageNumber > 1
                };

                response.data = paginatedData;
                response.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<List<UserResponseDTO>>> GetUnenrolledStudents()
        {
            var response = new ServiceResponse<List<UserResponseDTO>>();
            try
            {
                // Get all active students who do NOT have an ACTIVE enrollment
                var unenrolledStudents = await _context.Users
                    .Where(u => u.Role == UserRole.Student && u.Active)
                    .Where(u => !_context.Enrollments.Any(e => e.StudentId == u.Id && e.EnrollmentStatus == EnrollmentStatus.Active))
                    .Select(u => new UserResponseDTO
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        MiddleName = u.MiddleName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Role = u.Role,
                        Active = u.Active
                    })
                    .ToListAsync();

                response.data = unenrolledStudents;
                response.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        public async Task<ServiceResponse<List<Enrollment_Model>>> EnrollUsers(EnrollUserRequestDto request)
        {
            var response = new ServiceResponse<List<Enrollment_Model>>();
            var enrolledUsers = new List<Enrollment_Model>();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var department = await _context.Departments.FindAsync(request.DepartmentId);
                if (department == null)
                {
                    response.Success = false;
                    response.Message = "Department not found.";
                    return response;
                }else if (department.DepartmentStatus)
                {
                    response.Success = false;
                    response.Message = "Department not found.";
                    return response;
                }

                var effectiveTo = request.EffectiveFrom.AddYears(department.AcademicYear);
                int year = request.EffectiveFrom.Year;
                int currentCount = await _context.Enrollments.CountAsync(e => e.EffectiveFrom.Year == year);

                foreach (var userId in request.UserIds)
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user == null || !user.Active)
                    {
                        continue;
                    }

                    bool isDuplicate = await _context.Enrollments.AnyAsync(e =>
                        e.StudentId == userId &&
                        e.EnrollmentStatus == EnrollmentStatus.Active &&
                        ((request.EffectiveFrom >= e.EffectiveFrom && request.EffectiveFrom < e.EffectiveTo) ||
                         (effectiveTo > e.EffectiveFrom && effectiveTo <= e.EffectiveTo) ||
                         (request.EffectiveFrom <= e.EffectiveFrom && effectiveTo >= e.EffectiveTo))
                    );

                    if (isDuplicate)
                    {
                        continue;
                    }
                    currentCount++;
                    var rollNoStr = $"{year}{currentCount:D6}";
                    int rollNo = int.Parse(rollNoStr);

                    var enrollment = new Enrollment_Model
                    {
                        StudentId = userId,
                        DepartmentId = request.DepartmentId,
                        RollNo = rollNo,
                        EffectiveFrom = request.EffectiveFrom,
                        EffectiveTo = effectiveTo,
                        EnrollmentStatus = EnrollmentStatus.Active,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await _context.Enrollments.AddAsync(enrollment);
                    enrolledUsers.Add(enrollment);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                response.Success = true;
                response.Message = $"Enrolled {enrolledUsers.Count} users successfully.";
                response.data = enrolledUsers;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                await _logger.LogToDatabase("Enrollment", ErrorName.Failure.ToString(), ex.Message, JsonSerializer.Serialize(request));
                response.Success = false;
                response.Message = $"Failed to enroll users: {ex.Message}";
            }

            return response;
        }
        public async Task<bool> AlreadyEnrolled(string Email, DateTime EffectiveFrom, int DepartmentId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == Email);
            if(user == null)
            {
                return false;
            }
            if(!user.Active)
            {
                return false;
            }
            var Department = await _context.Departments.FindAsync(DepartmentId);
            if(Department == null)
            {
                return false;
            }
            if (!Department.DepartmentStatus)
            {
                return false;
            }
            DateTime effectiveTo = EffectiveFrom.AddYears(Department.AcademicYear);
            bool isDuplicate = await _context.Enrollments.AnyAsync(e =>
                        e.StudentId == user.Id &&
                        e.EnrollmentStatus == EnrollmentStatus.Active &&
                        ((EffectiveFrom >= e.EffectiveFrom && EffectiveFrom < e.EffectiveTo) ||
                         (effectiveTo > e.EffectiveFrom && effectiveTo <= e.EffectiveTo) ||
                         (EffectiveFrom <= e.EffectiveFrom && effectiveTo >= e.EffectiveTo))
                    );
            return isDuplicate;
        }

    }
}
