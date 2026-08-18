namespace DentaloreChat.Application.Interfaces.Services;
using DentaloreChat.Domain.Entities;
using DentaloreChat.Application.DTOs;
public interface IConversationService
{
    Task<IEnumerable<Conversation>> GetClinicConversationsAsync(Guid clinicId);
    Task<Conversation?> GetConversationDetailsAsync(Guid conversationId);
    Task<Conversation> CreateGroupAsync(CreateGroupDto dto);
    Task<Conversation?> DeleteGroupAsync(Guid conversationId);



}