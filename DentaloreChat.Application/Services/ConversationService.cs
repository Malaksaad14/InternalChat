namespace DentaloreChat.Application.Services;
using DentaloreChat.Application.Interfaces.Repositories;
using DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.DTOs;
public class ConversationService : IConversationService
{
    private readonly IConversationRepository _conversationRepo;

    public ConversationService(IConversationRepository conversationRepo)
    {
        _conversationRepo = conversationRepo;
    }

    public async Task<IEnumerable<Conversation>> GetClinicConversationsAsync(Guid clinicId)
    {
        // Business logic layer ensures we filter by clinic scope
        return await _conversationRepo.GetConversationsByClinicIdAsync(clinicId);
    }

    public async Task<Conversation?> GetConversationDetailsAsync(Guid conversationId)
    {
        return await _conversationRepo.GetByIdAsync(conversationId);
    }

    public async Task<Conversation> CreateGroupAsync(CreateGroupDto dto)
{
    var conversation = new Conversation
    {
        IsGroup = true,
        GroupName = dto.GroupName,
        ClinicId = dto.ClinicId,
        Members = dto.MemberIds.Select(id => new ConversationMember { UserId = id }).ToList()
    };

    await _conversationRepo.AddAsync(conversation);
    return conversation;
}

public async Task<Conversation?> DeleteGroupAsync(Guid conversationId)
{
    var conversation = await _conversationRepo.GetByIdAsync(conversationId);
    if (conversation != null && conversation.IsGroup)
    {
        await _conversationRepo.DeleteAsync(conversation);
        return conversation;
    }
    return null;
}


}