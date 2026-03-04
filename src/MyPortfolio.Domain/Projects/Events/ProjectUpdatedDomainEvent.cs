using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Projects.Events;

public sealed record ProjectUpdatedDomainEvent(Guid Id) : IDomainEvent;
