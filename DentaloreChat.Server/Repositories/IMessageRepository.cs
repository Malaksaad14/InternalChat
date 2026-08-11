public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
    Task<Message> AddAsync(Message message);
}