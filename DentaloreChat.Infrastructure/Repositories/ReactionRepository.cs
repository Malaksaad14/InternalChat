namespace DentaloreChat.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Infrastructure.Data;


public class ReactionRepository : IReactionRepository
{
    private readonly AppDbContext _context;

    public ReactionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reaction>> GetReactionsByMessageIdAsync(Guid messageId)
    {
        return await _context.Reactions
            .Where(r => r.MessageId == messageId)
            .ToListAsync();
    }

    public async Task<Reaction> AddAsync(Reaction reaction)
    {
        await _context.Reactions.AddAsync(reaction);
        await _context.SaveChangesAsync();
        return reaction;
    }

    public async Task<Reaction> RemoveAsync(Reaction reaction)
    {
        _context.Reactions.Remove(reaction);
        await _context.SaveChangesAsync();
        return reaction;
    }

    public async Task<Reaction?> GetSpecificReactionAsync(Guid messageId, Guid userId, string emoji)
    {
        return await _context.Reactions
            .FirstOrDefaultAsync(r => r.MessageId == messageId && r.UserId == userId && r.Emoji == emoji);
    }
}