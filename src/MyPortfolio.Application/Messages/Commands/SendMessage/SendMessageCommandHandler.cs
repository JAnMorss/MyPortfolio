using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Messages.Entities;
using MyPortfolio.Domain.Messages.Errors;
using MyPortfolio.Domain.Messages.Interface;
using MyPortfolio.Domain.Messages.ValueObjects;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Messages.Commands.SendMessage;

public sealed class SendMessageCommandHandler 
    : ICommandHandler<SendMessageCommand, MessageResponse>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SendMessageCommandHandler(
        IMessageRepository messageRepository, 
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MessageResponse>> Handle(
        SendMessageCommand request,
        CancellationToken cancellationToken)
    {
        
        var personNameResult = PersonName.Create(request.PersonName);
        if (personNameResult.IsFailure)
            return Result.Failure<MessageResponse>(personNameResult.Error);

        var emailResult = EmailAddress.Create(request.Email);
        if (emailResult.IsFailure)
            return Result.Failure<MessageResponse>(emailResult.Error);

        var phoneNumberResult = PhoneNumber.Create(request.PhoneNumber);
        if (phoneNumberResult.IsFailure)
            return Result.Failure<MessageResponse>(phoneNumberResult.Error);

        var contentResult = Content.Create(request.Content);
        if (contentResult.IsFailure)
            return Result.Failure<MessageResponse>(contentResult.Error);

        var sentToday = await _messageRepository.CountMessagesSentTodayAsync(
           request.PersonName,
           request.Email,
           cancellationToken
       );

        const int DailyLimit = 1;
        if (sentToday >= DailyLimit)
            return Result.Failure<MessageResponse>(MessageErrors.LimitExceeded);


        var message = new Message(
            Guid.NewGuid(),
            personNameResult.Value,
            emailResult.Value,
            phoneNumberResult.Value,
            contentResult.Value
        );

        await _messageRepository.AddAsync(message, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(MessageResponse.FromEntity(message));
    }
}
