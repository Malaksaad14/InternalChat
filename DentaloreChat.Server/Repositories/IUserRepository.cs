public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetUsersByClinicIdAsync(Guid clinicId);
}