using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.Domain.Messages.Errors;
using MyPortfolio.Domain.Messages.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Messages.Commands.DeleteMessage;

public sealed class DeleteMessageCommandHandler
    : ICommandHandler<DeleteMessageCommand>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteMessageCommandHandler(
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result> Handle(
        DeleteMessageCommand request,
        CancellationToken cancellationToken)
    {
        var message = await _messageRepository.GetByIdAsync(request.Id, cancellationToken);
        if (message is null)
            return Result.Failure<MessageResponse>(MessageErrors.NotFound);

        await _messageRepository.DeleteAsync(message.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
