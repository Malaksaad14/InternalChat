using Microsoft.AspNetCore.SignalR;

namespace DentaloreChat.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task LeaveConversation(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task SendMessage(int conversationId, int senderId, string content)
        {
            await Clients.Group($"conversation_{conversationId}").SendAsync("ReceiveMessage", conversationId, senderId, content, DateTime.UtcNow);
        }
    }
}
