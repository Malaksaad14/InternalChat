public interface IClinicRepository
{
    Task<Clinic?> GetByIdAsync(Guid id);
    Task<IEnumerable<Clinic>> GetAllAsync();
}