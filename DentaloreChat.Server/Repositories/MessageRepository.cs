using Microsoft.EntityFrameworkCore;

public class MessageRepository : IMessageRepository
{
    private readonly AppDbContext _context;

    public MessageRepository(AppDbContext context)
    {
        _context = context;
    }

    // UPDATED: Added page and pageSize for pagination
    public async Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(Guid conversationId, int page = 1, int pageSize = 20)
    {
        var messages = await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.Timestamp) // Start from the newest messages
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        messages.Reverse(); // Put them back in chronological order for the chat screen
        return messages;
    }

    public async Task<Message> AddAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
        return message;
    }
}