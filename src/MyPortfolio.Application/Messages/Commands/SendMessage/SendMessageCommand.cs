using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Messages.Commands.SendMessage;

public sealed record SendMessageCommand(
    string PersonName,
    string? Email,
    string? PhoneNumber,
    string Content
) : ICommand<MessageResponse>;