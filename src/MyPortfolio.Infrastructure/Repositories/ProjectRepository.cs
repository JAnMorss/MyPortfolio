using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class ProjectRepository
    : Repository<Project>, IProjectRepository
{
    public ProjectRepository(ApplicationDbContext context) 
        : base(context)
    {
    }

    protected override IQueryable<Project> BuildQuery(
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

    protected override IQueryable<Project> ApplySorting(
        IQueryable<Project> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query;
        query = queryObject.SortBy.ToLower() switch
        {
            "title" => queryObject.Descending
                ? query.OrderByDescending(e => e.Title.Value)
                : query.OrderBy(e => e.Title.Value),

            "techstack" => queryObject.Descending
                ? query.OrderByDescending(e => e.Techstack)
                : query.OrderBy(e => e.Techstack),

            _ => query
        };

        return query;
    }
}
