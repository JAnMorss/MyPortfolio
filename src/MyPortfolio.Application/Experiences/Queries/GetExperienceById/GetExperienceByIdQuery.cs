using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Experiences.Queries.GetExperienceById;

public sealed record GetExperienceByIdQuery(Guid Id) : IQuery<ExperienceResponse>;
