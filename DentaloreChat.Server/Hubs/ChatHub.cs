using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace DentaloreChat.Server.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<int, string> _onlineUsers = new ConcurrentDictionary<int, string>();

    public async Task UserConnected(int userId)
    {
        _onlineUsers[userId] = Context.ConnectionId;
        // ab3t l kol l users an l user da online
        await Clients.All.SendAsync("UpdateUserStatus", userId, true);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
       //lw l user mb2ash connected, remove mn l online users w ab3t l kol l users an l user da offline
        var userPair = _onlineUsers.FirstOrDefault(x => x.Value == Context.ConnectionId);
        if (userPair.Key != 0)
        {
            _onlineUsers.TryRemove(userPair.Key, out _);
            await Clients.All.SendAsync("UpdateUserStatus", userPair.Key, false);
        }

        await base.OnDisconnectedAsync(exception);
    }
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
        public async Task TypingStarted(int conversationId, string userName)
           {
                  await Clients.Group($"conversation_{conversationId}")
                 .SendAsync("UserTyping", userName);
            }

        public async Task TypingStopped(int conversationId, string userName)
           {
                  await Clients.Group($"conversation_{conversationId}")
                 .SendAsync("UserStopTyping", userName);
           }
    }
}
