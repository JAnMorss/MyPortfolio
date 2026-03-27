using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.UploadUserAvatar;

public sealed class UploadUserAvatarCommandHandler
    : ICommandHandler<UploadUserAvatarCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBlobService _blobService;

    private const string AvatarContainer = "avatars";

    public UploadUserAvatarCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IBlobService blobService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _blobService = blobService;
    }
    public async Task<Result> Handle(
    UploadUserAvatarCommand request,
    CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user is null)
                return Result.Failure(UserErrors.NotFound);

            // Delete old avatar
            if (user.Photo is not null)
            {
                var existingFileId = Photo.ExtractFileIdFromUrl(user.Photo.Value);
                if (existingFileId.HasValue)
                {
                    await _blobService.DeleteAsync(
                        AvatarContainer,
                        existingFileId.Value,
                        cancellationToken);
                }
            }

            using var stream = request.File.OpenReadStream();

            var contentType = string.IsNullOrEmpty(request.File.ContentType)
                ? "application/octet-stream"
                : request.File.ContentType;

            var newFileId = await _blobService.UploadAsync(
                AvatarContainer,
                stream,
                contentType,
                cancellationToken
            );

            var newAvatarUrl = _blobService.GetBlobUri(AvatarContainer, newFileId);

            var avatarResult = user.UpdateAvatar(newAvatarUrl);
            if (avatarResult.IsFailure)
                return Result.Failure(avatarResult.Error);

            await _userRepository.UpdateAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(new Error("Upload.Error", ex.Message));
        }
    }
}
