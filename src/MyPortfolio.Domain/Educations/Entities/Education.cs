using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Educations.Entities;

public sealed class Education : BaseEntity
{
    private Education() { }

    public Education(
        Guid id,
        string school,
        string degree,
        DateTime startDate,
        DateTime endDate,
        string? description,
        Guid userId) : base(id)
    {
        School = school;
        Degree = degree;
        StartDate = startDate;
        EndDate = endDate;
        Description = description;
        UserId = userId;
    }

    public string School { get; private set; } = null!;
    public string Degree { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public string? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
