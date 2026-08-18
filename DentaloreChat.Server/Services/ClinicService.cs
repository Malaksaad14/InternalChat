public class ClinicService : IClinicService
{
    private readonly IClinicRepository _clinicRepo;

    public ClinicService(IClinicRepository clinicRepo)
    {
        _clinicRepo = clinicRepo;
    }

    public async Task<Clinic?> GetClinicByIdAsync(Guid id)
    {
        return await _clinicRepo.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Clinic>> GetAllClinicsAsync()
    {
        return await _clinicRepo.GetAllAsync();
    }
}