using FluentValidation;

namespace MyPortfolio.Application.Projects.Commands.UpdateProject;

internal sealed class UpdateProjectCommandValidator
    : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Project ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Project ID.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Project title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Description must not exceed 2000 characters.");

        RuleFor(x => x.Techstack)
            .NotEmpty().WithMessage("Tech stack is required.")
            .MaximumLength(500).WithMessage("Tech stack must not exceed 500 characters.");

        RuleFor(x => x.Link)
            .Must(link => Uri.TryCreate(link, UriKind.Absolute, out var uri)
                          && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("Link must be a valid HTTP or HTTPS URL.")
            .When(x => !string.IsNullOrWhiteSpace(x.Link));
    }
}
