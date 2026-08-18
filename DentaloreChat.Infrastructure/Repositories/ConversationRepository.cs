namespace DentaloreChat.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Infrastructure.Data;
public class ConversationRepository : IConversationRepository
{
    private readonly AppDbContext _context;

    public ConversationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Conversation>> GetConversationsByClinicIdAsync(Guid clinicId)
    {
        // Enforces clinic-level data separation at the database level.
        return await _context.Conversations
            .Where(c => c.ClinicId == clinicId)
            .Include(c => c.Members)
            .ThenInclude(m => m.User)
            .ToListAsync();
    }

    public async Task<Conversation?> GetByIdAsync(Guid id)
    {
        return await _context.Conversations
            .Include(c => c.Members)
            .ThenInclude(m => m.User)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddAsync(Conversation conversation)
    {
        await _context.Conversations.AddAsync(conversation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Conversation conversation)
    {
        _context.Conversations.Remove(conversation);
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