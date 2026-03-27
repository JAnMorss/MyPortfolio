using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace MyPortfolio.Application.UserProfile.Commands.UploadUserAvatar;

internal sealed class UploadUserAvatarCommandValidator
    : AbstractValidator<UploadUserAvatarCommand>
{
    public UploadUserAvatarCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid User ID.");

        //RuleFor(x => x.File)
        //    .NotNull().WithMessage("Avatar file must be provided.")
        //    .Must(f => f!.Length > 0)
        //    .WithMessage("File cannot be empty.")
        //    .Must(f => IsSupportedFileType(f))
        //    .WithMessage("Unsupported file type. Allowed types: jpg, jpeg, png, gif.")
        //    .Must(f => f!.Length <= 5 * 1024 * 1024) 
        //    .WithMessage("File size cannot exceed 5 MB.");
    }

    private bool IsSupportedFileType(IFormFile file)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
        return allowedExtensions.Contains(extension);
    }
}
