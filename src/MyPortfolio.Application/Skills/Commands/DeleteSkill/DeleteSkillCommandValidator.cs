using FluentValidation;

namespace MyPortfolio.Application.Skills.Commands.DeleteSkill;

internal sealed class DeleteSkillCommandValidator
    : AbstractValidator<DeleteSkillCommand>
{
    public DeleteSkillCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Skill ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Skill ID.");
    }
}