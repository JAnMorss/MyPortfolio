using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.Infrastructure.Repositories.Base;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.Infrastructure.Repositories;

internal sealed class EducationRepository
    : Repository<Education>, IEducationRepository
{
    public EducationRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public override IQueryable<Education> ApplySorting(
        IQueryable<Education> query,
        QueryObject queryObject)
    {
        if (string.IsNullOrWhiteSpace(queryObject.SortBy))
            return query;

        query = queryObject.SortBy.ToLower() switch
        {
            "school" => queryObject.Descending
                ? query.OrderByDescending(e => e.School.Value)
                : query.OrderBy(e => e.School.Value),

            "degree" => queryObject.Descending
                ? query.OrderByDescending(e => e.Degree.Value)
                : query.OrderBy(e => e.Degree.Value),

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