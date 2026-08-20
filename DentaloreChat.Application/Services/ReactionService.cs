namespace DentaloreChat.Application.Services;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;

public class ReactionService : IReactionService
{
    private readonly IReactionRepository _reactionRepo;

    public ReactionService(IReactionRepository reactionRepo)
    {
        _reactionRepo = reactionRepo;
    }
    
    public async Task<Reaction?> ToggleReactionAsync(Guid messageId, Guid userId, string emoji)
    {
        // 1. Check if the user already reacted with this exact emoji
        var existingReaction = await _reactionRepo.GetSpecificReactionAsync(messageId, userId, emoji);

        if (existingReaction != null)
        {
            // User already reacted with this emoji, so remove the reaction
            await _reactionRepo.RemoveAsync(existingReaction);
            return null;
        }
        else
        {
            // User has not reacted with this emoji, so add the reaction
            var newReaction = new Reaction
            {
                MessageId = messageId,
                UserId = userId,
                Emoji = emoji
            };
            await _reactionRepo.AddAsync(newReaction);
            return newReaction;
        }
    }
}