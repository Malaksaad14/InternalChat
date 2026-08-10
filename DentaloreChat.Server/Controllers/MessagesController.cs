using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet("{conversationId}")]
    public async Task<IActionResult> GetHistory(int conversationId)
    {
        var messages = await _messageService.GetHistoryAsync(conversationId);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] Message message)
    {
        if (message == null || string.IsNullOrWhiteSpace(message.Content))
            return BadRequest("Message content cannot be empty.");

        await _messageService.SendMessageAsync(message);
        return Ok(message);
    }
}