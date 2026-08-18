public interface IConversationService
{
    Task<IEnumerable<Conversation>> GetClinicConversationsAsync(int clinicId);
    Task<Conversation?> GetConversationDetailsAsync(int conversationId);
    Task<Conversation> CreateGroupAsync(CreateGroupDto dto);
    Task<Conversation?> DeleteGroupAsync(int conversationId);



}