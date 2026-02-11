using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Experiences.Entities;

public sealed class Experience : BaseEntity
{
    private Experience() { }

    public Experience(
        Guid id,
        string companyName,
        DateTime? startDate, 
        DateTime? endDate, 
        string? description,
        Guid userId) : base(id)
    {
        CompanyName = companyName;
        StartDate = startDate;
        EndDate = endDate;
        Description = description;
        UserId = userId;
    }

    public string CompanyName { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public string? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
