using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.UpdateProject;

public sealed class UpdateProjectCommandHandler
    : ICommandHandler<UpdateProjectCommand, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProjectCommandHandler(
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProjectResponse>> Handle(
        UpdateProjectCommand request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
        if (project is null)
            return Result.Failure<ProjectResponse>(ProjectErrors.NotFound);

        var updateResult = project.Update(
            request.Title,
            request.Description,
            request.Techstack,
            request.Link
        );
        if (updateResult.IsFailure)
            return Result.Failure<ProjectResponse>(updateResult.Error);

        await _projectRepository.UpdateAsync(project, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(ProjectResponse.FromEntity(project));
    }
}
