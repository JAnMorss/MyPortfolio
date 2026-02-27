using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Educations.Queries.GetAllEducations;

public sealed record GetAllEducationsQuery(
    QueryObject? Query,
    Guid UserId
) : IQuery<PaginatedResult<EducationResponse>>;
