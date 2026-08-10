public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepo;

    public MessageService(IMessageRepository messageRepo)
    {
        _messageRepo = messageRepo;
    }

    public async Task<IEnumerable<Message>> GetHistoryAsync(int conversationId)
    {
        return await _messageRepo.GetMessagesByConversationIdAsync(conversationId);
    }

    public async Task SendMessageAsync(Message message)
    {
        // Business rule validation
        if (string.IsNullOrWhiteSpace(message.Content))
        {
            throw new ArgumentException("Message content cannot be empty.");
        }

        message.Timestamp = DateTime.UtcNow;
        await _messageRepo.AddAsync(message);
    }
}