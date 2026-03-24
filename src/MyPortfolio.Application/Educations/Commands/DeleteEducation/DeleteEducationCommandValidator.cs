using FluentValidation;

namespace MyPortfolio.Application.Educations.Commands.DeleteEducation;

internal sealed class DeleteEducationCommandValidator
    : AbstractValidator<DeleteEducationCommand>
{
    public DeleteEducationCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Education ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Education ID.");
    }
}