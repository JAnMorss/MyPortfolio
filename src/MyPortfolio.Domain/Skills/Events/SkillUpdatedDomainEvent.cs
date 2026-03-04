using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Skills.Events;

public sealed record SkillUpdatedDomainEvent(Guid Id) : IDomainEvent;
