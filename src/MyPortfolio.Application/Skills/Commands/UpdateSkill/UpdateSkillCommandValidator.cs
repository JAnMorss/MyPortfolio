using FluentValidation;

namespace MyPortfolio.Application.Skills.Commands.UpdateSkill;

internal sealed class UpdateSkillCommandValidator
    : AbstractValidator<UpdateSkillCommand>
{
    public UpdateSkillCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Skill ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Skill ID.");

        RuleFor(x => x.SkillName)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(150).WithMessage("Skill name must not exceed 150 characters.");

        RuleFor(x => x.Level)
            .NotNull().WithMessage("Skill level is required.")
            .IsInEnum().WithMessage("Invalid skill level.");
    }
}