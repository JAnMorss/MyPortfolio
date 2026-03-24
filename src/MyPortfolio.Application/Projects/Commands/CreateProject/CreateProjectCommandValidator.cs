using FluentValidation;

namespace MyPortfolio.Application.Projects.Commands.CreateProject;

internal sealed class CreateProjectCommandValidator
    : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
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
            .Must(link => Uri.TryCreate(link, UriKind.Absolute, out _))
            .WithMessage("Invalid project link.")
            .When(x => !string.IsNullOrWhiteSpace(x.Link));

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid User ID.");
    }
}