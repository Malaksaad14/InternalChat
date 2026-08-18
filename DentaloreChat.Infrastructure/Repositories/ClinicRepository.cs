namespace DentaloreChat.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Infrastructure.Data;

public class ClinicRepository : IClinicRepository
{
    private readonly AppDbContext _context;

    public ClinicRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Clinic?> GetByIdAsync(Guid id)
    {
        // Fetch a specific clinic along with its users for clinic-level scoping
        return await _context.Clinics
            .Include(c => c.Users)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Clinic>> GetAllAsync()
    {
        return await _context.Clinics
            .Include(c => c.Users)
            .ToListAsync();
    }
}