using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Errors;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.UploadProjectMedia;

public sealed class UploadProjectMediaCommandHandler
    : ICommandHandler<UploadProjectMediaCommand>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    private const string Container = "project-media";

    public UploadProjectMediaCommandHandler(
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork,
        IBlobService blobService)
    {
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }

    public async Task<Result> Handle(
        UploadProjectMediaCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
            if (project is null)
                return Result.Failure(ProjectErrors.NotFound);

            if (project.MediaUrl is not null)
            {
                var existingFileId = Photo.ExtractFileIdFromUrl(project.MediaUrl.Value);
                if (existingFileId.HasValue)
                {
                    await _blobService.DeleteAsync(Container, existingFileId.Value, cancellationToken);
                }
            }

            using var stream = request.File.OpenReadStream();

            var contentType = string.IsNullOrEmpty(request.File.ContentType)
                ? "application/octet-stream"
                : request.File.ContentType;

            var newFileId = await _blobService.UploadAsync(
                Container,
                stream,
                contentType,
                cancellationToken
            );

            var newMediaUrl = _blobService.GetBlobUri(Container, newFileId);

            var mediaResult = project.UpdateMedia(newMediaUrl);
            if (mediaResult.IsFailure)
                return Result.Failure(mediaResult.Error);

            await _projectRepository.UpdateAsync(project, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(new Error("Upload.Error", ex.Message));
        }
    }
}