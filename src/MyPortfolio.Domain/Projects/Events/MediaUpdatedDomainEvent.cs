using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Projects.Events;

public sealed record MediaUpdatedDomainEvent(Guid Id) : IDomainEvent;
