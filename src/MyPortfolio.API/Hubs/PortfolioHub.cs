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
        var count = _viewService.Increment();

        await Clients.All.SendAsync("ReceiveViewCount", count);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // var count = _viewService.Decrement();
        // await Clients.All.SendAsync("ReceiveViewCount", count);

        await base.OnDisconnectedAsync(exception);
    }
}