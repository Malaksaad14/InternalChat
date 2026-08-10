public class Conversation
{
    public int Id { get; set; }
    public bool IsGroup { get; set; } = false;
    public string? GroupName { get; set; }
    
    // Clinic scope to enforce security and separation
    public int ClinicId { get; set; }
    
    public ICollection<ConversationMember>? Members { get; set; }
    public ICollection<Message>? Messages { get; set; }
}