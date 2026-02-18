using MediatR;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.SharedKernel.Mediators.Command;

public interface ICommandHandler<TCommand>
    : IRequestHandler<TCommand, Result>
    where TCommand : ICommand
{
}

public interface ICommandHandler<TCommand, TResponse>
    : IRequestHandler<TCommand, Result<TResponse>>
    where TCommand : ICommand<TResponse>
{
}
