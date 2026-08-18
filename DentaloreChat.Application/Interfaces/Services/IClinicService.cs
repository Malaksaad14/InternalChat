namespace DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;
public interface IClinicService
{
    Task<Clinic?> GetClinicByIdAsync(Guid id);
    Task<IEnumerable<Clinic>> GetAllClinicsAsync();
}