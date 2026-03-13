using Microsoft.EntityFrameworkCore;
using MyPortfolio.Domain.Messages.Entities;
using MyPortfolio.Domain.Messages.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class MessageRepository
    : Repository<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    protected override IQueryable<Message> ApplySorting(
        IQueryable<Message> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query;
        query = queryObject.SortBy.ToLower() switch
        {
            "personname" => queryObject.Descending
                ? query.OrderByDescending(e => e.PersonName.Value)
                : query.OrderBy(e => e.PersonName.Value),

            "phonenumber" => queryObject.Descending
                ? query.OrderByDescending(e => e.PhoneNumber)
                : query.OrderBy(e => e.PhoneNumber),

            _ => query
        };

        return query;
    }

    public async Task<int> CountMessagesSentTodayAsync(
        string personName,
        string? email,
        CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;

        return await _context.Messages
        .Where(m => m.SentAt >= today &&
                    m.PersonName.Value == personName &&
                    (email == null || m.Email!.Value == email)) 
        .CountAsync(cancellationToken);
    }
}
