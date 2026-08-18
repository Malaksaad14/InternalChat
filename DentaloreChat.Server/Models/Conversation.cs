public class Conversation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool IsGroup { get; set; } = false;
    public string? GroupName { get; set; }
    
    // Clinic scope to enforce security and separation
    public Guid ClinicId { get; set; } = Guid.NewGuid();
    
    public ICollection<ConversationMember>? Members { get; set; }
    public ICollection<Message>? Messages { get; set; }
}