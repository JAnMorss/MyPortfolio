using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Projects.Queries.GetAllProjects;

public sealed record GetAllProjectsQuery(QueryObject? Query) : IQuery<PaginatedResult<ProjectResponse>>;
