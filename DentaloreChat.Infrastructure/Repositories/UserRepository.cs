
namespace DentaloreChat.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Infrastructure.Data;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        // Fetch user by ID with their associated clinic details
        return await _context.Users
            .Include(u => u.Clinic)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<IEnumerable<User>> GetUsersByClinicIdAsync(Guid clinicId)
    {
        // Fetch all users belonging to a specific clinic (enforces data separation)
        return await _context.Users
            .Where(u => u.ClinicId == clinicId)
            .ToListAsync();
    }
}