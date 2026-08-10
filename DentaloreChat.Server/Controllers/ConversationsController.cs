using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ConversationsController : ControllerBase
{
    private readonly IConversationService _conversationService;

    public ConversationsController(IConversationService conversationService)
    {
        _conversationService = conversationService;
    }

    [HttpGet("clinic/{clinicId}")]
    public async Task<IActionResult> GetClinicConversations(int clinicId)
    {
        var conversations = await _conversationService.GetClinicConversationsAsync(clinicId);
        return Ok(conversations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetConversationDetails(int id)
    {
        var conversation = await _conversationService.GetConversationDetailsAsync(id);
        if (conversation == null) return NotFound();
        return Ok(conversation);
    }
}