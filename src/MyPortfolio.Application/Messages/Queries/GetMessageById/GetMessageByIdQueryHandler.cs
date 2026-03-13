using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.Domain.Messages.Errors;
using MyPortfolio.Domain.Messages.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Messages.Queries.GetMessageById;

public sealed class GetMessageByIdQueryHandler
    : IQueryHandler<GetMessageByIdQuery, MessageResponse>
{
    private readonly IMessageRepository _messageRepository;

    public GetMessageByIdQueryHandler(
        IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task<Result<MessageResponse>> Handle(
        GetMessageByIdQuery request,
        CancellationToken cancellationToken)
    {
        var message = await _messageRepository.GetByIdAsync(request.Id, cancellationToken);
        if (message is null)
            return Result.Failure<MessageResponse>(MessageErrors.NotFound);

        return Result.Success(MessageResponse.FromEntity(message));
    }
}
