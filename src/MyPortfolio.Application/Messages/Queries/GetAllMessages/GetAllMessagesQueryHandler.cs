using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.Domain.Messages.Errors;
using MyPortfolio.Domain.Messages.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Messages.Queries.GetAllMessages;

public sealed class GetAllMessagesQueryHandler
    : IQueryHandler<GetAllMessagesQuery, PaginatedResult<MessageResponse>>
{
    private readonly IMessageRepository _messageRepository;

    public GetAllMessagesQueryHandler(
        IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task<Result<PaginatedResult<MessageResponse>>> Handle(
        GetAllMessagesQuery request, 
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var message = await _messageRepository.GetAllAsync(query, cancellationToken);
        if (message is null)
            return Result.Failure<PaginatedResult<MessageResponse>>(MessageErrors.NotFound);

        var mapped = message
            .Select(MessageResponse.FromEntity)
            .ToList();

        var totalCount = await _messageRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<MessageResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize
        );

        return Result.Success(result);
    }
}
