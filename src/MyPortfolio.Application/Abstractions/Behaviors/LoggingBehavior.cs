using MediatR;
using Microsoft.Extensions.Logging;
using MyPortfolio.SharedKernel.ErrorHandling;
using Serilog.Context;

namespace MyPortfolio.Application.Abstractions.Behaviors;

public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseRequest
    where TResponse : Result
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next, 
        CancellationToken cancellationToken)
    {
        var name = request.GetType().Name;

        try
        {
            _logger.LogInformation("Executing request {Request}", name);

            var result = await next();

            if (result.IsSuccess)
            {
                _logger.LogInformation("Request {Request} processed successfully", name);
            }
            else
            {
                using(LogContext.PushProperty("Errors", result.Error, true))
                {
                    _logger.LogError("Request {Request} processed with errors", name);
                }
            }

            return result;
        }
        catch (Exception ex) 
        {
            _logger.LogInformation(ex, "Request {Request} proccessing failed", name);
            throw;
        }
    }
}
