using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Messages.Commands.DeleteMessage;

public sealed record DeleteMessageCommand(Guid Id) : ICommand;