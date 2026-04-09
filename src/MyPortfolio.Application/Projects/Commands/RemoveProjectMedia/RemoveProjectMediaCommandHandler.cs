using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.RemoveProjectMedia;

public sealed class RemoveProjectMediaCommandHandler
    : ICommandHandler<RemoveProjectMediaCommand>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    private const string Container = "project-media";

    public RemoveProjectMediaCommandHandler(
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork,
        IBlobService blobService)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }

    public async Task<Result> Handle(
        RemoveProjectMediaCommand request,
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project is null)
            return Result.Failure(ProjectErrors.NotFound);

        if (!project.Media.Any(m => m.Value == request.MediaUrl))
            return Result.Failure(ProjectErrors.MediaNotFound);

        var fileId = Photo.ExtractFileIdFromUrl(request.MediaUrl);
        if (!fileId.HasValue)
            return Result.Failure(ProjectErrors.InvalidMedia);

        await _blobService.DeleteAsync(
            Container,
            fileId.Value,
            cancellationToken
        );

        var result = project.RemoveMedia(request.MediaUrl);
        if (result.IsFailure)
            return Result.Failure(result.Error);

        await _projectRepository.UpdateAsync(project, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}