public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(Guid conversationId, int page = 1, int pageSize = 20);
    Task<Message> AddAsync(Message message);
}