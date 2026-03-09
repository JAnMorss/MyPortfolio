using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.DeleteProject;

public sealed class DeleteProjectCommandHandler
    : ICommandHandler<DeleteProjectCommand>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProjectCommandHandler(
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        DeleteProjectCommand request, 
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);
        if(project is null)
            return Result.Failure(ProjectErrors.NotFound);

        await _projectRepository.DeleteAsync(project.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
