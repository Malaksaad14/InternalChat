public interface IClinicService
{
    Task<Clinic?> GetClinicByIdAsync(int id);
    Task<IEnumerable<Clinic>> GetAllClinicsAsync();
}