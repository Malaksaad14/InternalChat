public interface IMessageService
{
    Task<IEnumerable<Message>> GetHistoryAsync(Guid conversationId, int page = 1, int pageSize = 20);
    Task<Message> SendMessageAsync(Message message);
}