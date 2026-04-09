using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Projects.Queries.GetProjectMedia;

public sealed class GetProjectMediaQueryHandler
    : IQueryHandler<GetProjectMediaQuery, ProjectMediaResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IBlobService _blobService;

    private const string MediaContainer = "project-media";

    public GetProjectMediaQueryHandler(
        IProjectRepository projectRepository,
        IBlobService blobService)
    {
        _projectRepository = projectRepository;
        _blobService = blobService;
    }

    public async Task<Result<ProjectMediaResponse>> Handle(
    GetProjectMediaQuery request, 
    CancellationToken cancellationToken)
{
    var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);

    if (project is null)
        return Result.Failure<ProjectMediaResponse>(ProjectErrors.NotFound);

    if (!project.Media.Any())
        return Result.Failure<ProjectMediaResponse>(ProjectErrors.MediaNotFound);

    var response = ProjectMediaResponse.FromEntity(project);

    return Result.Success(response);
}
}
