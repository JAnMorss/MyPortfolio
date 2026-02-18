using MediatR;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.SharedKernel.Mediators.Query;

public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
}
