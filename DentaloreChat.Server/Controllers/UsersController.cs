using Microsoft.AspNetCore.Mvc;
using DentaloreChat.Application.Interfaces.Services;
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("clinic/{clinicId}")]
    public async Task<IActionResult> GetUsersByClinic(Guid clinicId)
    {
        var users = await _userService.GetUsersByClinicAsync(clinicId);
        return Ok(users);
    }
}