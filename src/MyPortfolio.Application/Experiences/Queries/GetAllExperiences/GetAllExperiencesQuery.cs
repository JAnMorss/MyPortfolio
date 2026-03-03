using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Experiences.Queries.GetAllExperiences;

public sealed record GetAllExperiencesQuery(
    QueryObject? Query,
    Guid UserId
) : IQuery<PaginatedResult<ExperienceResponse>>;
