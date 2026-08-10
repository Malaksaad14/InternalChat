public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
    Task<IEnumerable<User>> GetUsersByClinicAsync(int clinicId);
}