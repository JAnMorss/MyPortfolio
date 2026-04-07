using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserProfileViewedDomainEvent(Guid UserId, int TotalViews) : IDomainEvent;