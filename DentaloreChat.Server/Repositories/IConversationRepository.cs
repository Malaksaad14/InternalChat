public interface IConversationRepository
{
    Task<IEnumerable<Conversation>> GetConversationsByClinicIdAsync(int clinicId);
    Task<Conversation?> GetByIdAsync(int id);
    Task AddAsync(Conversation conversation);
    Task DeleteAsync(Conversation conversation);

}