using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserUpdateEmailDomainEvent(Guid Id) : IDomainEvent;