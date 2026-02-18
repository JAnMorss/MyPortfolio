using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserUpdateDomainEvent(Guid Id) : IDomainEvent;
