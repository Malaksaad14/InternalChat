using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DentaloreChat.Server.Hubs;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Services;

[Route("api/[controller]")]
[ApiController]
public class ReactionController : ControllerBase
{
    private readonly IReactionService _reactionService;
    private readonly IHubContext<ChatHub> _hubContext;
    public ReactionController(IReactionService reactionService, IHubContext<ChatHub> hubContext)
    {
        _reactionService = reactionService;
        _hubContext = hubContext;
    }
    [HttpPost("{messageId}/user/{userId}/toggle")]
    public async Task<IActionResult> ToggleReaction(Guid messageId, Guid userId, [FromBody] string emoji)
    {
        var reaction = await _reactionService.ToggleReactionAsync(messageId, userId, emoji);
        var actionTaken = reaction==null ? "removed" : "added";
        await _hubContext.Clients.All.SendAsync("ReceiveReactionUpdate", messageId, userId, emoji, actionTaken);
        return Ok(new
        {
            Action = actionTaken,
            Reaction = reaction
        });
    }
}