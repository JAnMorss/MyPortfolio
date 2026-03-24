using FluentValidation;

namespace MyPortfolio.Application.Skills.Commands.CreateSkill;

internal sealed class CreateSkillCommandValidator
    : AbstractValidator<CreateSkillCommand>
{
    public CreateSkillCommandValidator()
    {
        RuleFor(x => x.SkillName)
            .NotEmpty().WithMessage("Skill name is required.")
            .MaximumLength(150).WithMessage("Skill name must not exceed 150 characters.");

        RuleFor(x => x.Level)
            .NotNull().WithMessage("Skill level is required.")
            .IsInEnum().WithMessage("Invalid skill level.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid User ID.");
    }
}