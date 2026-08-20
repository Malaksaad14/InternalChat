namespace DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;
public interface IReactionService
{
    // Returns the Reaction if added, or null if it was removed (toggled off)
    Task<Reaction?> ToggleReactionAsync(Guid messageId, Guid userId, string emoji);
}