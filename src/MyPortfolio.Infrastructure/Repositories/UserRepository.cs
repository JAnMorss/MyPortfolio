using Microsoft.EntityFrameworkCore;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    public override IQueryable<User> BuildQuery(ApplicationDbContext context, QueryObject query)
    {
        var q = context.Users
            .Include(p => p.Roles)
            .Include(u => u.RefreshTokens)
            .AsQueryable();

        return q;
    }

    public override async Task AddAsync(
        User user,
        CancellationToken cancellationToken = default)
    {
        foreach (var role in user.Roles) 
        {
            _context.Attach(role);
        }

        await _context.AddAsync(user, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(
    EmailAddress email,
    CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(_context, null); 

        return await query
            .FirstOrDefaultAsync(u => u.Email.Value == email.Value, cancellationToken);
    }

}
