using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace MyPortfolio.Application.Projects.Commands.UploadProjectMedia;

internal sealed class UploadProjectMediaCommandValidator
    : AbstractValidator<UploadProjectMediaCommand>
{
    public UploadProjectMediaCommandValidator()
    {
        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Project ID.");

        RuleFor(x => x.Files)
            .NotEmpty().WithMessage("At least one file must be provided.");

        RuleForEach(x => x.Files).ChildRules(files =>
        {
            files.RuleFor(f => f)
                .NotNull().WithMessage("File must be provided.")
                .Must(f => f!.Length > 0)
                .WithMessage("File cannot be empty.")
                .Must(f => IsSupportedFileType(f))
                .WithMessage("Unsupported file type. Allowed types: jpg, jpeg, png, gif, mp4.");
        });
    }

    private bool IsSupportedFileType(IFormFile file)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".mp4" };
        var extension = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
        return allowedExtensions.Contains(extension);
    }
}