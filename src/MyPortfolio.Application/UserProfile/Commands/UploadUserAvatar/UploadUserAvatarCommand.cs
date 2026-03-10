using Microsoft.AspNetCore.Http;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.UploadUserAvatar;

public sealed record UploadUserAvatarCommand(
    Guid UserId,
    IFormFile File
) : ICommand;
