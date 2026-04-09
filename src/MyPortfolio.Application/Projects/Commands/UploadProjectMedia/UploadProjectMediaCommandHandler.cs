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

            var uploadedUrls = new List<string>();

            foreach (var file in request.Files)
            {
                if (!file.ContentType.StartsWith("image/") &&
                    !file.ContentType.StartsWith("video/"))
                {
                    return Result.Failure(ProjectErrors.InvalidFile);
                }

                using var stream = file.OpenReadStream();

                var contentType = string.IsNullOrEmpty(file.ContentType)
                    ? "application/octet-stream"
                    : file.ContentType;

                var fileId = await _blobService.UploadAsync(
                    Container,
                    stream,
                    contentType,
                    cancellationToken
                );

                var url = _blobService.GetBlobUri(Container, fileId);
                uploadedUrls.Add(url);
            }

            var result = project.AddMedia(uploadedUrls);
            if (result.IsFailure)
                return Result.Failure(result.Error);

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