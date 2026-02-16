using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Experiences.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Experiences.Entities;

public sealed class Experience : BaseEntity
{
    private Experience() { }

    public Experience(
        Guid id,
        CompanyName companyName,
        DateTime? startDate, 
        DateTime? endDate,
        Description? description,
        Guid userId) : base(id)
    {
        CompanyName = companyName;
        StartDate = startDate;
        EndDate = endDate;
        Description = description;
        UserId = userId;
    }

    public CompanyName CompanyName { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public Description? Description { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
