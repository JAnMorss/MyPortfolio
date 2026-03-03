using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class ExperienceRepository 
    : Repository<Experience>, IExperienceRepository
{
    public ExperienceRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    protected override IQueryable<Experience> BuildQuery(
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

    protected override IQueryable<Experience> ApplySorting(
        IQueryable<Experience> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query;
        query = queryObject.SortBy.ToLower() switch
        {
            "companyname" => queryObject.Descending
                ? query.OrderByDescending(e => e.CompanyName.Value)
                : query.OrderBy(e => e.CompanyName.Value),

            "startdate" => queryObject.Descending
                ? query.OrderByDescending(e => e.StartDate)
                : query.OrderBy(e => e.StartDate),

            "enddate" => queryObject.Descending
                ? query.OrderByDescending(e => e.EndDate)
                : query.OrderBy(e => e.EndDate),

            _ => query
        };

        return query;
    }
}
