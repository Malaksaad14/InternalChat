public interface IConversationService
{
    Task<IEnumerable<Conversation>> GetClinicConversationsAsync(int clinicId);
    Task<Conversation?> GetConversationDetailsAsync(int conversationId);
}