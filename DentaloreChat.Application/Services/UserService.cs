namespace DentaloreChat.Application.Services;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;
public class UserService : IUserService
{
    private readonly IUserRepository _userRepo;

    public UserService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _userRepo.GetByIdAsync(id);
    }

    public async Task<IEnumerable<User>> GetUsersByClinicAsync(Guid clinicId)
    {
        return await _userRepo.GetUsersByClinicIdAsync(clinicId);
    }
}