using FluentValidation;

namespace MyPortfolio.Application.UserProfile.Commands.UpdateDetails;

internal sealed class UpdateDetailsCommandValidator
    : AbstractValidator<UpdateDetailsCommand>
{
    public UpdateDetailsCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid User ID.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

        RuleFor(x => x.Age)
            .InclusiveBetween(0, 150)
            .WithMessage("Age must be between 0 and 150.");

        RuleFor(x => x.HeadLine)
            .NotEmpty().WithMessage("Headline is required.")
            .MaximumLength(150).WithMessage("Headline must not exceed 150 characters.");

        RuleFor(x => x.About)
            .MaximumLength(2000)
            .WithMessage("About section must not exceed 2000 characters.");
    }
}