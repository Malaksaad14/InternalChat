namespace DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Domain.Entities;
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<IEnumerable<User>> GetUsersByClinicIdAsync(Guid clinicId);
}