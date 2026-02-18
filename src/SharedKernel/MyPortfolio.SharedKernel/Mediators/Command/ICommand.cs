using MediatR;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.SharedKernel.Mediators.Command;

public interface ICommand : IRequest<Result>, IBaseCommand { }

public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand { }

public interface IBaseCommand { }
