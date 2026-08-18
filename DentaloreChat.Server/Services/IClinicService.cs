public interface IClinicService
{
    Task<Clinic?> GetClinicByIdAsync(Guid id);
    Task<IEnumerable<Clinic>> GetAllClinicsAsync();
}