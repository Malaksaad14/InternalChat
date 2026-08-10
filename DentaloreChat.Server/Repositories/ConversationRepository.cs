using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ConversationRepository : IConversationRepository
{
    private readonly AppDbContext _context;

    public ConversationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Conversation>> GetConversationsByClinicIdAsync(int clinicId)
    {
        // Removed .Include() to prevent JSON Circular Reference serialization crashes.
        // Enforces clinic-level data separation at the database level.
        return await _context.Conversations
            .Where(c => c.ClinicId == clinicId)
            .ToListAsync();
    }

    public async Task<Conversation?> GetByIdAsync(int id)
    {
        // Removed .Include() to prevent JSON Circular Reference serialization crashes.
        return await _context.Conversations
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddAsync(Conversation conversation)
    {
        await _context.Conversations.AddAsync(conversation);
        await _context.SaveChangesAsync();
    }
}










// using Microsoft.EntityFrameworkCore;

// public class ConversationRepository : IConversationRepository
// {
//     private readonly AppDbContext _context;

//     public ConversationRepository(AppDbContext context)
//     {
//         _context = context;
//     }

//     public async Task<IEnumerable<Conversation>> GetConversationsByClinicIdAsync(int clinicId)
//     {
//         // Enforce clinic-level data separation at database level
//         return await _context.Conversations
//             .Where(c => c.ClinicId == clinicId)
//             .Include(c => c.Members!)
//             .ThenInclude(m => m.User)
//             .ToListAsync();
//     }

//     public async Task<Conversation?> GetByIdAsync(int id)
//     {
//         return await _context.Conversations
//             .Include(c => c.Members!)
//             .ThenInclude(m => m.User)
//             .Include(c => c.Messages!)
//             .FirstOrDefaultAsync(c => c.Id == id);
//     }

//     public async Task AddAsync(Conversation conversation)
//     {
//         await _context.Conversations.AddAsync(conversation);
//         await _context.SaveChangesAsync();
//     }
// }