public interface IMessageService
{
    Task<IEnumerable<Message>> GetHistoryAsync(int conversationId);
    Task<Message> SendMessageAsync(Message message);
}