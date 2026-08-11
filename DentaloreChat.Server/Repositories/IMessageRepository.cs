public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId, int page = 1, int pageSize = 20);
    Task<Message> AddAsync(Message message);
}