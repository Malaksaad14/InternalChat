public interface IClinicRepository
{
    Task<Clinic?> GetByIdAsync(int id);
    Task<IEnumerable<Clinic>> GetAllAsync();
}