using Microsoft.AspNetCore.SignalR;
using MyPortfolio.Application.Abstractions.Realtime;

namespace MyPortfolio.API.Hubs;

public class PortfolioHub : Hub
{
    private readonly IProfileViewService _viewService;

    public PortfolioHub(IProfileViewService viewService)
    {
        _viewService = viewService;
    }

    public override async Task OnConnectedAsync()
    {
        var isAuthenticated = Context.User?.Identity?.IsAuthenticated ?? false;

        if (!isAuthenticated)
        {
            var count = _viewService.Increment();
            await Clients.All.SendAsync("ReceiveViewCount", count);
        }

        await base.OnConnectedAsync();
    }
}