namespace MyPortfolio.Application.Educations.Commands.CreateEducation;

internal sealed class CreateEducationCommandValidator
    : AbstractValidator<CreateEducationCommand>
{
    public CreateEducationCommandValidator()
    {
        RuleFor(x => x.School)
            .NotEmpty().WithMessage("School cannot be empty.")
            .MaximumLength(100).WithMessage("School cannot exceed 100 characters.");

        RuleFor(x => x.Degree)
            .NotEmpty().WithMessage("Degree cannot be empty.")
            .MaximumLength(100).WithMessage("Degree cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.EndDate.HasValue)
            .WithMessage("End date must be greater than start date.");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");
    }
}
🎯 What this valid