using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserAvatarUpdatedDomainEvent(Guid Id) : IDomainEvent;
