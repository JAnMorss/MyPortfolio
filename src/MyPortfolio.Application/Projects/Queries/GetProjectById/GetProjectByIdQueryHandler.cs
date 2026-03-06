using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Projects.Queries.GetProjectById;

public sealed class GetProjectByIdQueryHandler
    : IQueryHandler<GetProjectByIdQuery, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;

    public GetProjectByIdQueryHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<ProjectResponse>> Handle(
        GetProjectByIdQuery request,
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
        if(project is null)
            return Result.Failure<ProjectResponse>(ProjectErrors.NotFound);

        return Result.Success(ProjectResponse.FromEntity(project));
    }
}
