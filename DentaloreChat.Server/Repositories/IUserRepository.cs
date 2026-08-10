public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetUsersByClinicIdAsync(int clinicId);
}