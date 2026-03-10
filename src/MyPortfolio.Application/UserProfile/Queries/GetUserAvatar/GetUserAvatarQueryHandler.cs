using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.UserProfile.Queries.GetUserAvatar;

public sealed class GetUserAvatarQueryHandler
    : IQueryHandler<GetUserAvatarQuery, UserAvatarResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IBlobService _blobService;

    private const string AvatarContainer = "avatars";

    public GetUserAvatarQueryHandler(
        IUserRepository userRepository,
        IBlobService blobService)
    {
        _userRepository = userRepository;
        _blobService = blobService;
    }

    public async Task<Result<UserAvatarResponse>> Handle(
        GetUserAvatarQuery request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if(user is null) 
            return Result.Failure<UserAvatarResponse>(UserErrors.NotFound);

        if (user.Photo is null || string.IsNullOrWhiteSpace(user.Photo.Value))
            return Result.Failure<UserAvatarResponse>(UserErrors.AvatarNotFound);

        var fileId = Photo.ExtractFileIdFromUrl(user.Photo.Value);
        if (!fileId.HasValue)
            return Result.Failure<UserAvatarResponse>(UserErrors.InvalidAvatar);

        var downloadResult = await _blobService.DownloadAsync(
            AvatarContainer,
            fileId.Value,
            cancellationToken
        );
        if (downloadResult is null)
            return Result.Failure<UserAvatarResponse>(UserErrors.AvatarNotFound);

        using var memoryStream = new MemoryStream();

        await downloadResult.Stream.CopyToAsync(memoryStream, cancellationToken);

        var imageBytes = memoryStream.ToArray();

        var response = UserAvatarResponse.FromEntity(
            user, 
            imageBytes, 
            downloadResult.ContentType
        );

        return Result.Success(response);
    }
}
