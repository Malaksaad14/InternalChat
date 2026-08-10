public interface IMessageService
{
    Task<IEnumerable<Message>> GetHistoryAsync(int conversationId);
    Task SendMessageAsync(Message message);
}