using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class FacultyController : ControllerBase
    {
        private readonly IFacultyServices _facultyService;
        private readonly ILogServices _logService;

        public FacultyController(IFacultyServices facultyService, ILogServices logService)
        {
            _facultyService = facultyService;
            _logService = logService;
        }

        [HttpPost]
        public async Task<IActionResult> AddFaculty([FromBody] FacultyDto facultyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _facultyService.AddFacultyAsync(facultyDto);
                if (result == null)
                    return StatusCode(500, "Failed to add faculty.");

                return Ok(new { message = "Faculty added successfully.", faculty = result });
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("AddFaculty", "Error", ex.Message, "{}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaculty(int id, [FromBody] FacultyDto facultyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _facultyService.UpdateFacultyAsync(id, facultyDto);
                if (result == null)
                    return NotFound(new { message = "Faculty not found." });

                return Ok(new { message = "Faculty updated successfully.", faculty = result });
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("UpdateFaculty", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            try
            {
                var result = await _facultyService.DeleteFacultyAsync(id);
                return result
                    ? Ok(new { message = "Faculty soft-deleted successfully." })
                    : NotFound(new { message = "Faculty not found." });
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("DeleteFaculty", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFacultyById(int id)
        {
            try
            {
                var faculty = await _facultyService.GetFacultyByIdAsync(id);
                return faculty != null
                    ? Ok(faculty)
                    : NotFound(new { message = "Faculty not found." });
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("GetFacultyById", "Error", ex.Message, $"{{ \"Id\": {id} }}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFaculties()
        {
            try
            {
                var faculties = await _facultyService.GetAllFacultiesAsync();
                return Ok(faculties);
            }
            catch (Exception ex)
            {
                await _logService.LogToDatabase("GetAllFaculties", "Error", ex.Message, "{}");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
