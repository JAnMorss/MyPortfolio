using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class SkillRepository 
    : Repository<Skill>, ISkillRepository
{
    public SkillRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    protected override IQueryable<Skill> BuildQuery(
        ApplicationDbContext context,
        QueryObject query,
        Guid? userId = null)
    {
        var baseQuery = base.BuildQuery(context, query, userId);

        if (userId.HasValue)
        {
            baseQuery = baseQuery.Where(e => e.UserId == userId.Value);
        }

        return baseQuery;
    }

    protected override IQueryable<Skill> ApplySorting(
        IQueryable<Skill> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query;

        query = queryObject.SortBy.ToLower() switch
        {
            "skillname" => queryObject.Descending
                ? query.OrderByDescending(e => e.SkillName.Value)
                : query.OrderBy(e => e.SkillName.Value),

            _ => query
        };

        return query;
    }
}
