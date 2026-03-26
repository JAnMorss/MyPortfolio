using FluentValidation;

namespace MyPortfolio.Application.UserProfile.Commands.ChangeEmail;

public sealed class ChangeEmailCommandValidator
    : AbstractValidator<ChangeEmailCommand>
{
    public ChangeEmailCommandValidator()
    {
        RuleFor(x => x.NewEmail)
            .NotEmpty().WithMessage("Email cannot be empty.");
    }
}
