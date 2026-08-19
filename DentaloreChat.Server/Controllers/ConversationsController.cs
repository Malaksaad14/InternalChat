using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DentaloreChat.Server.Hubs;
using DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Application.DTOs; // Add this if your controllers use CreateGroupDto

[Route("api/[controller]")]
[ApiController]
public class ConversationsController : ControllerBase
{
    private readonly IConversationService _conversationService;
    private readonly IHubContext<ChatHub> _hubContext;

    public ConversationsController(IConversationService conversationService, IHubContext<ChatHub> hubContext)
    {
        _conversationService = conversationService;
        _hubContext = hubContext;
    } 

    [HttpGet("clinic/{clinicId}")]
    public async Task<IActionResult> GetClinicConversations(Guid clinicId)
    {
        var conversations = await _conversationService.GetClinicConversationsAsync(clinicId);
        return Ok(conversations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetConversationDetails(Guid id)
    {
        var conversation = await _conversationService.GetConversationDetailsAsync(id);
        if (conversation == null) return NotFound();
        return Ok(conversation);
    }

    [HttpPost("group")]
    public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.GroupName) || dto.MemberIds == null || !dto.MemberIds.Any())
            return BadRequest("Group name and members are required.");

        var newGroup = await _conversationService.CreateGroupAsync(dto);

        // Broadcast to everyone in this clinic so their sidebar updates instantly 
       _= _hubContext.Clients.Group($"clinic_{dto.ClinicId}")
            .SendAsync("GroupCreated", newGroup.Id, newGroup.GroupName, dto.MemberIds);

        return Ok(newGroup);
    }
  [HttpDelete("group/{id}")]
  //hena l controller hyst2bl l http delete request w hyroh yms7 l conversation mn l DB 3n tare2 l repository
  //wl service hyrg3 l deleted conv ll controller ashan y call l hubcontext
  // ashan y broadcast l kol l clients
public async Task<IActionResult> DeleteGroup(Guid id)
{
    var deletedGroup = await _conversationService.DeleteGroupAsync(id);
    
    if (deletedGroup == null) return NotFound("Group not found or is not a group.");

    // Broadcast to the clinic that this group was deleted
    //el line da byb3t hagten:
    //l event name: GroupDeleted
    //wel payload(l id bta3 l group)
    _= _hubContext.Clients.Group($"clinic_{deletedGroup.ClinicId}")
        .SendAsync("GroupDeleted", deletedGroup.Id);

    return Ok();
}


}