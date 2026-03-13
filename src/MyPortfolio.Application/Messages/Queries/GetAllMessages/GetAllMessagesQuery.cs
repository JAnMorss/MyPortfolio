using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Messages.Queries.GetAllMessages;

public sealed record GetAllMessagesQuery(QueryObject? Query) : IQuery<PaginatedResult<MessageResponse>>;
