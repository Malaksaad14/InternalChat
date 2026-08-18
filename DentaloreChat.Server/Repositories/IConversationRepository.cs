public interface IConversationRepository
{
    Task<IEnumerable<Conversation>> GetConversationsByClinicIdAsync(Guid clinicId);
    Task<Conversation?> GetByIdAsync(Guid id);
    Task AddAsync(Conversation conversation);
    Task DeleteAsync(Conversation conversation);

}