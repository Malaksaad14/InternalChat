public class UserService : IUserService
{
    private readonly IUserRepository _userRepo;

    public UserService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _userRepo.GetByIdAsync(id);
    }

    public async Task<IEnumerable<User>> GetUsersByClinicAsync(int clinicId)
    {
        return await _userRepo.GetUsersByClinicIdAsync(clinicId);
    }
}