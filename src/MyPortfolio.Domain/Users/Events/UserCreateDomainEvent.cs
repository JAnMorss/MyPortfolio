using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Users.Events;

public sealed record UserCreateDomainEvent(Guid Id) : IDomainEvent;
