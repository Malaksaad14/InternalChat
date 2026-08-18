namespace DentaloreChat.Domain.Entities;
public class ConversationMember
{
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}