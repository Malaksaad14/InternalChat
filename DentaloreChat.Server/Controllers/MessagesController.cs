using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DentaloreChat.Server.Hubs;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.Interfaces.Services;

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
        if (message == null || (string.IsNullOrWhiteSpace(message.Content) && string.IsNullOrWhiteSpace(message.ImageUrl)))
            return BadRequest("Message must have content or an image.");

        var savedMessage = await _messageService.SendMessageAsync(message);
        
        // Broadcast the message to all clients in the conversation
        //_ =  is C#'s "discard" operator, tells the compiler: I know this is an async task,
        // but I don't want to await it. Just run it in the background.
        _= _hubContext.Clients.Group($"conversation_{savedMessage.ConversationId}")
            .SendAsync("ReceiveMessage", savedMessage.ConversationId, savedMessage.SenderId, savedMessage.Content, savedMessage.Timestamp, savedMessage.ImageUrl);
        
        return Ok(savedMessage);
    }
    //4. hena byst2bl l request w y3ml folder asmo uploads lw msh mwgod 
    [HttpPost("upload")]
    public async Task <IActionResult>UploadImage(IFormFile file)
    {
            if (file == null || file.Length == 0)
        return BadRequest("No file uploaded.");
    //  y3ml folder asmo uploads lw msh mawgod
    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);
    // 2. bndy l file name unique 3shan lw fe sora tanya b nfs l esm
    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
    // 3. bn save l sora 3l hard disk bta3 l server
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    // 4.bnrg3 l url l ha2e2y bta3 l sora ll frontend(handle send tany)
    var imageUrl = $"/uploads/{uniqueFileName}";
    
    return Ok(new { imageUrl });
    }
}