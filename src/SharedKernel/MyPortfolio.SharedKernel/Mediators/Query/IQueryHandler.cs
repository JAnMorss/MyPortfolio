using MediatR;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.SharedKernel.Mediators.Query;

public interface IQueryHandler<TQuery, TResponse>
    : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse>
{
}
