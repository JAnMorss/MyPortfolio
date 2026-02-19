using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.SharedKernel.Repositories;

public interface IRepository<T> where T : BaseEntity
{
    Task<IEnumerable<T>> GetAllASync(QueryObject query, CancellationToken cancellationToken = default);

    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task AddAsync(T entity, CancellationToken cancellationToken = default);

    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    
    Task<int> CountAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<T>> SearchAsync(SearchQueryObject searchQuery, Guid? userId, CancellationToken cancellationToken = default);
}
