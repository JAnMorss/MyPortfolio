using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Experiences.Events;

public sealed record ExperienceUpdatedDomainEvent(Guid Id) : IDomainEvent;