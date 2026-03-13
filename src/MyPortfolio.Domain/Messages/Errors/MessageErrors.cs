using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Messages.Errors;

public static class MessageErrors
{
    public static readonly Error NotFound = new(
        "Message.NotFound",
        "The Message with the specified identifier was not found."
    );

    public static readonly Error LimitExceeded = new(
        "Message.LimitExceeded",
        "You can only send 1 messages per day."
    );
     
}
