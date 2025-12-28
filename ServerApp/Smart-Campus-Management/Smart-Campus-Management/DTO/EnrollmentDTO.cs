using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.DTO
{
    public class EnrollmentDTO
    {
    }
    public class EnrollmentListItemDto
    {
        public int Id { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; }
        public string Email { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime EffectiveTo { get; set; }
        public EnrollmentStatus Status { get; set; }
    }
    public class AddEnrollmentDTO
    {
        public Guid StudentId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime EffectiveFrom { get; set; }
    }


    public class UpdateEnrollmentDTO
    {
        public int Id { get; set; }
        public Guid StudentId { get; set; }
        public int DepartmentId { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public EnrollmentStatus EnrollmentStatus { get; set; }
    }


    public class EnrollUserRequestDto
    {
        public List<Guid> UserIds { get; set; } = new();
        public int DepartmentId { get; set; }
        public DateTime EffectiveFrom { get; set; }
    }

    public class GetEnrolledUsersFilterDto
    {
        public string? Search { get; set; }
        public int? FacultyId { get; set; }
        public int? DepartmentId { get; set; }
        public int? EnrollmentYear { get; set; }
        public EnrollmentStatus? Status { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
        public UserRole? Role { get; set; }
    }

    public class EnrolledUserResponseDto
    {
        public int EnrollmentId { get; set; }
        public Guid UserId { get; set; }
        public UserResponseDTO User { get; set; }
    }

    public class PaginatedEnrollmentResponse
    {
        public List<EnrollmentListItemDto> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
