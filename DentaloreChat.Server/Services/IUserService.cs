public interface IUserService
{
    Task<User?> GetUserByIdAsync(Guid id);
    Task<IEnumerable<User>> GetUsersByClinicAsync(Guid clinicId);
}