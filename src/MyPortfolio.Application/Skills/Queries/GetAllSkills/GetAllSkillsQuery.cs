
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Skills.Queries.GetAllSkills;

public sealed record GetAllSkillsQuery(
    QueryObject? Query,
    Guid UserId
) : IQuery<PaginatedResult<SkillResponse>>;
