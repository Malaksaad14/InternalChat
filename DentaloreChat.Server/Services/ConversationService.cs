public class ConversationService : IConversationService
{
    private readonly IConversationRepository _conversationRepo;

    public ConversationService(IConversationRepository conversationRepo)
    {
        _conversationRepo = conversationRepo;
    }

    public async Task<IEnumerable<Conversation>> GetClinicConversationsAsync(int clinicId)
    {
        // Business logic layer ensures we filter by clinic scope
        return await _conversationRepo.GetConversationsByClinicIdAsync(clinicId);
    }

    public async Task<Conversation?> GetConversationDetailsAsync(int conversationId)
    {
        return await _conversationRepo.GetByIdAsync(conversationId);
    }
}