using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Messages.Queries.GetMessageById;

public sealed record GetMessageByIdQuery(Guid Id) : IQuery<MessageResponse>;