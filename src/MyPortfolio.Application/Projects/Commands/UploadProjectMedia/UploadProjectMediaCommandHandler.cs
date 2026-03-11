using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.UploadProjectMedia;

public sealed class UploadProjectMediaCommandHandler
    : ICommandHandler<UploadProjectMediaCommand>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IBlobService _blobService;
    private readonly IUnitOfWork _unitOfWork;

    private const string Container = "project-media";

    public UploadProjectMediaCommandHandler(
        IProjectRepository projectRepository,
        IBlobService blobService,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _blobService = blobService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        UploadProjectMediaCommand request,
        CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);

        if (project is null)
            return Result.Failure(ProjectErrors.NotFound);

        if (project.MediaUrl is not null)
        {
            var existingFileId = Photo.ExtractFileIdFromUrl(project.MediaUrl.Value);
            if (existingFileId.HasValue)
                await _blobService.DeleteAsync(Container, existingFileId.Value);
        }

        using var stream = request.File.OpenReadStream();

        var fileId = await _blobService.UploadAsync(
            Container,
            stream,
            request.File.ContentType,
            cancellationToken);

        var mediaUrl = _blobService.GetBlobUri(Container, fileId);

        var result = project.UpdateMedia(mediaUrl);
        if (result.IsFailure)
            return result;

        await _projectRepository.UpdateAsync(project, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
