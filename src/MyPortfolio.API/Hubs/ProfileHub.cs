using Microsoft.AspNetCore.SignalR;

namespace MyPortfolio.API.Hubs;

public class ProfileHub : Hub
{
    public async Task JoinProfileGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }
}
