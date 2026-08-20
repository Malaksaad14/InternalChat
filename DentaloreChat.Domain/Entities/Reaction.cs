namespace DentaloreChat.Domain.Entities;
public class Reaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Emoji { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }

    
    // Navigation properties
    public Message? Message { get; set; }
    public User? User { get; set; }
}