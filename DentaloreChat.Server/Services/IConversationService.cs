public interface IConversationService
{
    Task<IEnumerable<Conversation>> GetClinicConversationsAsync(Guid clinicId);
    Task<Conversation?> GetConversationDetailsAsync(Guid conversationId);
    Task<Conversation> CreateGroupAsync(CreateGroupDto dto);
    Task<Conversation?> DeleteGroupAsync(Guid conversationId);



}