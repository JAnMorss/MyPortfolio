using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Educations.Events;

public sealed record EducationUpdatedDomainEvent(Guid Id) : IDomainEvent;