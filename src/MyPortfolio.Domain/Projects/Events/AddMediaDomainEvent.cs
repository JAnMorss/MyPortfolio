using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Projects.Events;

public sealed record AddMediaDomainEvent(Guid Id) : IDomainEvent;
