using FluentValidation;

namespace MyPortfolio.Application.Projects.Commands.DeleteProject;

internal sealed class DeleteProjectCommandValidator
    : AbstractValidator<DeleteProjectCommand>
{
    public DeleteProjectCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Project ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Project ID.");
    }
}