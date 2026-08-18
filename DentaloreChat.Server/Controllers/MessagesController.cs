using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DentaloreChat.Server.Hubs;

[Route("api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IHubContext<ChatHub> _hubContext;

    public MessagesController(IMessageService messageService, IHubContext<ChatHub> hubContext)
    {
        _messageService = messageService;
        _hubContext = hubContext;
    }

    // UPDATED: Accepts query parameters for pagination
    [HttpGet("{conversationId}")]
    public async Task<IActionResult> GetHistory(Guid conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        
        var messages = await _messageService.GetHistoryAsync(conversationId, page, pageSize);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] Message message)
    {
        if (message == null || string.IsNullOrWhiteSpace(message.Content))
            return BadRequest("Message content cannot be empty.");

        var savedMessage = await _messageService.SendMessageAsync(message);
        
        // Broadcast the message to all clients in the conversation
        //_ =  is C#'s "discard" operator, tells the compiler: I know this is an async task,
        // but I don't want to await it. Just run it in the background.
        _= _hubContext.Clients.Group($"conversation_{savedMessage.ConversationId}")
            .SendAsync("ReceiveMessage", savedMessage.ConversationId, savedMessage.SenderId, savedMessage.Content, savedMessage.Timestamp);
        
        return Ok(savedMessage);
    }
}