using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ClinicsController : ControllerBase
{
    private readonly IClinicService _clinicService;

    public ClinicsController(IClinicService clinicService)
    {
        _clinicService = clinicService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClinic(Guid id)
    {
        var clinic = await _clinicService.GetClinicByIdAsync(id);
        if (clinic == null) return NotFound();
        return Ok(clinic);
    }
}