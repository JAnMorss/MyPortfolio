using MediatR;
using Microsoft.AspNetCore.SignalR;
using MyPortfolio.Domain.Users.Events;

namespace MyPortfolio.API.Hubs;

public sealed class UserProfileViewedDomainEventHandler
    : INotificationHandler<UserProfileViewedDomainEvent>
{
    private readonly IHubContext<ProfileHub> _hubContext;
    public UserProfileViewedDomainEventHandler(IHubContext<ProfileHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task Handle(
        UserProfileViewedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        await _hubContext.Clients
            .Group(notification.UserId.ToString())
            .SendAsync("ProfileViewed", notification.TotalViews, cancellationToken);
    }
}