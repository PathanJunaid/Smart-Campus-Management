using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smart_Campus_Management.DTO;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentServices _departmentServices;

        public DepartmentController(IDepartmentServices departmentServices)
        {
            _departmentServices = departmentServices;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _departmentServices.AddDepartment(model);
                return Ok(created);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "Failed to create department.", error = ex.Message });
            }
        }

        // ✅ READ ALL - Any Authenticated User
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDepartments()
        {
            try
            {
                var departments = await _departmentServices.GetAllDepartments();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch departments", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            try
            {
                var department = await _departmentServices.GetDepartmentById(id);
                if (department == null)
                    return NotFound(new { message = $"Department with ID {id} not found." });

                return Ok(department);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch department", error = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department_Model model)
        {
            try
            {
                var updated = await _departmentServices.UpdateDepartment(id, model);
                if (updated == null)
                    return NotFound(new { message = $"Department with ID {id} not found or update failed." });

                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update department", error = ex.Message });
            }
        }

        // ✅ DELETE - Admin Only
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var result = await _departmentServices.DeleteDepartment(id);
                if (!result)
                    return NotFound(new { message = $"Department with ID {id} not found or delete failed." });

                return Ok(new { message = $"Department with ID {id} deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete department", error = ex.Message });
            }
        }
    }
}
