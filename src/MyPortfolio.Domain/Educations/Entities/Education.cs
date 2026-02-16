using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Educations.Entities;

public sealed class Education : BaseEntity
{
    private Education() { }

    public Education(
        Guid id,
        School school,
        Degree degree,
        DateTime startDate,
        DateTime endDate,
        Description? description,
        Guid userId) : base(id)
    {
        School = school;
        Degree = degree;
        StartDate = startDate;
        EndDate = endDate;
        Description = description;
        UserId = userId;
    }

    public School School { get; private set; } = null!;
    public Degree Degree { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public Description? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
