using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Application.Abstractions;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken);
}
