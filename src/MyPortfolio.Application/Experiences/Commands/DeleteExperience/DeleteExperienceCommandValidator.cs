using FluentValidation;

namespace MyPortfolio.Application.Experiences.Commands.DeleteExperience;

internal sealed class DeleteExperienceCommandValidator
    : AbstractValidator<DeleteExperienceCommand>
{
    public DeleteExperienceCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Experience ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Experience ID.");
    }
}