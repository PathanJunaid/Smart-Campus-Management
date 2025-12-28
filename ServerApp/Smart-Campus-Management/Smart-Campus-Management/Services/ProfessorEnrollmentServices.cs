using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;
using System.Text.Json;

namespace Smart_Campus_Management.Services
{
    public class ProfessorEnrollmentServices : IProfessorEnrollmentServices
    {
        private readonly AppDbContext _context;
        private readonly ILogServices _logger;

        public ProfessorEnrollmentServices(AppDbContext context, ILogServices logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ServiceResponse<ProfessorEnrollmentResponseDTO>> AddEnrollment(AddProfessorEnrollmentDTO request)
        {
            var response = new ServiceResponse<ProfessorEnrollmentResponseDTO>();
            try
            {
                //var existingEnrollment = await _context.ProfessorEnrollments
                //    .FirstOrDefaultAsync(pe => pe.UserId == request.UserId && pe.DepartmentId == request.DepartmentId && pe.IsActive);

                //if (existingEnrollment != null)
                //{
                //    response.Success = false;
                //    response.Message = "Professor is already enrolled in this department.";
                //    return response;
                //}

                var enrollment = new ProfessorEnrollmentModal
                {
                    UserId = request.UserId,
                    DepartmentId = request.DepartmentId,
                    IsActive = true,
                    AssignedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    LastUpdatedAt = DateTime.UtcNow
                };

                await _context.ProfessorEnrollments.AddAsync(enrollment);
                await _context.SaveChangesAsync();

                // Hydrate response details
                var user = await _context.Users.FindAsync(request.UserId);
                var dept = await _context.Departments.FindAsync(request.DepartmentId);

                response.data = new ProfessorEnrollmentResponseDTO
                {
                    Id = enrollment.Id,
                    UserId = enrollment.UserId,
                    DepartmentId = enrollment.DepartmentId,
                    ProfessorName = $"{user?.FirstName} {user?.LastName}",
                    DepartmentName = dept?.DepartmentName,
                    AssignedAt = enrollment.AssignedAt,
                    IsActive = enrollment.IsActive
                };
                response.Message = "Professor enrolled successfully.";
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("ProfessorEnrollment", "Failure", ex.Message, JsonSerializer.Serialize(request));
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<ProfessorEnrollmentResponseDTO>> UpdateEnrollment(UpdateProfessorEnrollmentDTO request)
        {
            var response = new ServiceResponse<ProfessorEnrollmentResponseDTO>();
            try
            {
                var enrollment = await _context.ProfessorEnrollments.FindAsync(request.Id);
                if (enrollment == null)
                {
                    response.Success = false;
                    response.Message = "Enrollment not found.";
                    return response;
                }

                enrollment.IsActive = request.IsActive;
                if (!request.IsActive)
                {
                    enrollment.RemovedAt = DateTime.UtcNow;
                }
                enrollment.LastUpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                response.data = new ProfessorEnrollmentResponseDTO
                {
                    Id = enrollment.Id,
                    UserId = enrollment.UserId,
                    DepartmentId = enrollment.DepartmentId,
                    IsActive = enrollment.IsActive,
                    AssignedAt = enrollment.AssignedAt
                };
                response.Message = "Enrollment updated successfully.";
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("ProfessorEnrollment", "Failure", ex.Message, JsonSerializer.Serialize(request));
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteEnrollment(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var enrollment = await _context.ProfessorEnrollments.FindAsync(id);
                if (enrollment == null)
                {
                    response.Success = false;
                    response.Message = "Enrollment not found.";
                    return response;
                }

                _context.ProfessorEnrollments.Remove(enrollment);
                await _context.SaveChangesAsync();
                response.data = true;
                response.Message = "Enrollment deleted successfully.";
            }
            catch (Exception ex)
            {
                await _logger.LogToDatabase("ProfessorEnrollment", "Failure", ex.Message, id.ToString());
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<List<ProfessorEnrollmentResponseDTO>>> GetAllEnrollments()
        {
             var response = new ServiceResponse<List<ProfessorEnrollmentResponseDTO>>();
            try
            {
                // Note: Assuming navigation properties would be better, but doing manual join for now given model definition
                var enrollments = await _context.ProfessorEnrollments
                    .Where(e => e.IsActive)
                    .ToListAsync();
                
                var dtos = new List<ProfessorEnrollmentResponseDTO>();

                foreach (var en in enrollments)
                {
                    var user = await _context.Users.FindAsync(en.UserId);
                    var dept = await _context.Departments.FindAsync(en.DepartmentId);
                    
                    dtos.Add(new ProfessorEnrollmentResponseDTO
                    {
                        Id = en.Id,
                        UserId = en.UserId,
                        DepartmentId = en.DepartmentId,
                        ProfessorName = $"{user?.FirstName} {user?.LastName}",
                        DepartmentName = dept?.DepartmentName,
                        AssignedAt = en.AssignedAt,
                        IsActive = en.IsActive
                    });
                }

                response.data = dtos;
            }
            catch (Exception ex)
            {
                 response.Success = false;
                 response.Message = ex.Message;
            }
            return response;
        }
    }
}
