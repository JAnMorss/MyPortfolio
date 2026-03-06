using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Projects.Queries.GetAllProjects;

public sealed class GetAllProjectsQueryHandler
    : IQueryHandler<GetAllProjectsQuery, PaginatedResult<ProjectResponse>>
{
    private readonly IProjectRepository _projectRepository;

    public GetAllProjectsQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<PaginatedResult<ProjectResponse>>> Handle(
        GetAllProjectsQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var project = await _projectRepository.GetAllAsync(query, cancellationToken);
        if(project is null)
            return Result.Failure<PaginatedResult<ProjectResponse>>(ProjectErrors.NotFound);

        var mapped = project
            .Select(ProjectResponse.FromEntity)
            .ToList();

        var totalCount = await _projectRepository.CountAsync(request.UserId, cancellationToken);

        var result = new PaginatedResult<ProjectResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize
        );

        return Result.Success(result);
    }
}
