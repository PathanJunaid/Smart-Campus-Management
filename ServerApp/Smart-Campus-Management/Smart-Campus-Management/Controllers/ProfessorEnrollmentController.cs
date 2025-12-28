using Microsoft.AspNetCore.Mvc;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessorEnrollmentController : ControllerBase
    {
        private readonly IProfessorEnrollmentServices _professorEnrollmentServices;
        public ProfessorEnrollmentController(IProfessorEnrollmentServices professorEnrollmentServices)
        {
            _professorEnrollmentServices = professorEnrollmentServices;
        }

        [HttpPost("enroll")]
        public async Task<ActionResult<ServiceResponse<ProfessorEnrollmentResponseDTO>>> EnrollProfessor(AddProfessorEnrollmentDTO request)
        {
            var response = await _professorEnrollmentServices.AddEnrollment(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut("update")]
        public async Task<ActionResult<ServiceResponse<ProfessorEnrollmentResponseDTO>>> UpdateEnrollment(UpdateProfessorEnrollmentDTO request)
        {
            var response = await _professorEnrollmentServices.UpdateEnrollment(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteEnrollment(int id)
        {
            var response = await _professorEnrollmentServices.DeleteEnrollment(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("all")]
        public async Task<ActionResult<ServiceResponse<List<ProfessorEnrollmentResponseDTO>>>> GetAllEnrollments()
        {
            var response = await _professorEnrollmentServices.GetAllEnrollments();
            return Ok(response);
        }
    }
}
