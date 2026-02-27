using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Educations.Entities;

public sealed class Education : BaseEntity
{
    private Education() { }

    public Education(
        Guid id,
        School school,
        Degree degree,
        DateTime? startDate,
        DateTime? endDate,
        Description? description,
        Guid userId) : base(id)
    {
        School = school;
        Degree = degree;
        Description = description;
        UserId = userId;

        var result = SetDateRange(startDate, endDate);
    }

    public School School { get; private set; } = null!;
    public Degree Degree { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public Description? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Result SetDateRange(DateTime? startDate, DateTime? endDate)
    {
        if (!startDate.HasValue)
            return Result.Failure(EducationErrors.StartDateRequired);

        if (endDate.HasValue && endDate.Value < startDate.Value)
            return Result.Failure(EducationErrors.EndDateBeforeStartDate);

        StartDate = startDate.Value;
        EndDate = endDate;

        return Result.Success();
    }
}
