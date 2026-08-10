public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
    Task AddAsync(Message message);
}