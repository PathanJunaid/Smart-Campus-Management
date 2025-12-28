using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Controllers
{
    [Route("api/enrollment")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentServices _enrollmentServices;

        public EnrollmentController(IEnrollmentServices enrollmentServices)
        {
            _enrollmentServices = enrollmentServices;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EnrollUser([FromBody] EnrollUserRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var response = await _enrollmentServices.EnrollUsers(request);
                if (!response.Success)
                {
                    return BadRequest(response);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to enroll users.", error = ex.Message });
            }
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEnrollments([FromQuery] GetEnrolledUsersFilterDto filter)
        {
            var response = await _enrollmentServices.GetEnrollments(filter);
            if (!response.Success)
                return BadRequest(response);
            
            return Ok(response);
        }

        [HttpGet("unenrolled-students")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUnenrolledStudents()
        {
            var response = await _enrollmentServices.GetUnenrolledStudents();
            if (!response.Success)
                return BadRequest(response);
            
            return Ok(response);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEnrollment([FromBody] UpdateEnrollmentDTO request)
        {
            var response = await _enrollmentServices.UpdateEnrollment(request);
            if (!response.Success)
                return BadRequest(response);
            
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var response = await _enrollmentServices.DeleteEnrollment(id);
            if (!response.Success)
                return BadRequest(response);
            
            return Ok(response);
        }
        
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEnrollment([FromBody] AddEnrollmentDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _enrollmentServices.AddEnrollment(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
