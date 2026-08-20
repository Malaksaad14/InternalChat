namespace DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Domain.Entities;
public interface IReactionRepository
{
    Task<IEnumerable<Reaction>> GetReactionsByMessageIdAsync(Guid messageId);
    Task<Reaction> AddAsync(Reaction reaction);
    Task<Reaction> RemoveAsync(Reaction reaction);
    Task<Reaction?> GetSpecificReactionAsync(Guid messageId, Guid userId, string emoji);
}