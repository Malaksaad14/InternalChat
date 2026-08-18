namespace DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Domain.Entities;
public interface IClinicRepository
{
    Task<Clinic?> GetByIdAsync(Guid id);
    Task<IEnumerable<Clinic>> GetAllAsync();
}