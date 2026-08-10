
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        // Fetch user by ID with their associated clinic details
        return await _context.Users
            .Include(u => u.Clinic)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<IEnumerable<User>> GetUsersByClinicIdAsync(int clinicId)
    {
        // Fetch all users belonging to a specific clinic (enforces data separation)
        return await _context.Users
            .Where(u => u.ClinicId == clinicId)
            .ToListAsync();
    }
}