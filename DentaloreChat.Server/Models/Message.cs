public class Message
{
    public int Id { get; set; }
    public string? Content { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int ConversationId { get; set; }
    public int SenderId { get; set; }
}