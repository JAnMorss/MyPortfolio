using FluentValidation;

namespace MyPortfolio.Application.Educations.Commands.UpdateEducation;

internal sealed class UpdateEducationCommandValidator
    : AbstractValidator<UpdateEducationCommand>
{
    public UpdateEducationCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Education ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Education ID.");

        RuleFor(x => x.School)
            .NotEmpty().WithMessage("School is required.")
            .MaximumLength(200).WithMessage("School must not exceed 200 characters.");

        RuleFor(x => x.Degree)
            .NotEmpty().WithMessage("Degree is required.")
            .MaximumLength(200).WithMessage("Degree must not exceed 200 characters.");

        RuleFor(x => x.StartDate)
            .NotNull().WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate!)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage("End date cannot be earlier than start date.");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Description must not exceed 1000 characters.");
    }
}
