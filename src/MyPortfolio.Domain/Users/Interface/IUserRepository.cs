using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Repositories;

namespace MyPortfolio.Domain.Users.Interface;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken cancellationToken = default);
}
