using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserUpdatePasswordDomainEvent(Guid Id) : IDomainEvent;
