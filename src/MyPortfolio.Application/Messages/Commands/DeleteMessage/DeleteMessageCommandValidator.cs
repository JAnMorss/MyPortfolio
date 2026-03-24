using FluentValidation;

namespace MyPortfolio.Application.Messages.Commands.DeleteMessage;

internal sealed class DeleteMessageCommandValidator
    : AbstractValidator<DeleteMessageCommand>
{
    public DeleteMessageCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Message ID cannot be empty.")
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid Message ID.");
    }
}