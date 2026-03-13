using MyPortfolio.Domain.Messages.Entities;
using MyPortfolio.SharedKernel.Repositories;

namespace MyPortfolio.Domain.Messages.Interface;

public interface IMessageRepository : IRepository<Message>
{
    Task<int> CountMessagesSentTodayAsync(string personName, string? email, CancellationToken cancellationToken = default);
}
