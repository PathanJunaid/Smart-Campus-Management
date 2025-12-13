using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Enums;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
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
                };
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
        public async Task<bool> UpdateEnrollment(UpdateEnrollmentDTO Enroll)
        {
            try
            {
                var Enrollment = await _context.Enrollments.FirstOrDefaultAsync(e => e.Id == Enroll.Id);
                if (Enrollment == null)
                {
                    throw new Exception("Enrollment not found!");
                }
                Enrollment.StudentId = Enroll.StudentId;
                Enrollment.DepartmentId = Enroll.DepartmentId;
                Enrollment.EnrollmentStatus = Enroll.EnrollmentStatus;
                Enrollment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                await _logger.LogToDatabase("Enrollment", ErrorName.Success.ToString(), $"Enrollement with ${Enroll.Id} successfully updated!", JsonSerializer.Serialize(Enroll));
                return true;
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("Enrollment", ErrorName.Failure.ToString(), ex.Message, JsonSerializer.Serialize(Enroll));
                throw ex;
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
                }

                var effectiveTo = request.EffectiveFrom.AddYears(department.AcademicYear);

                foreach (var userId in request.UserIds)
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user == null || !user.Active)
                    {
                        continue;
                    }

                    bool isDuplicate = await _context.Enrollments.AnyAsync(e =>
                        e.StudentId == userId &&
                        e.DepartmentId == request.DepartmentId &&
                        e.EnrollmentStatus == EnrollmentStatus.Active &&
                        ((request.EffectiveFrom >= e.EffectiveFrom && request.EffectiveFrom < e.EffectiveTo) ||
                         (effectiveTo > e.EffectiveFrom && effectiveTo <= e.EffectiveTo) ||
                         (request.EffectiveFrom <= e.EffectiveFrom && effectiveTo >= e.EffectiveTo))
                    );

                    if (isDuplicate)
                    {
                        continue;
                    }

                    var enrollment = new Enrollment_Model
                    {
                        StudentId = userId,
                        DepartmentId = request.DepartmentId,
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
    }
}
