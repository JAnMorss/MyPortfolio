using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Experiences.Events;
using MyPortfolio.Domain.Experiences.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

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
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public CompanyName CompanyName { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public Description? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;


    public Result UpdateExperience(
        string companyName,
        DateTime? startDate,
        DateTime? endDate,
        string? description)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(companyName) && companyName != CompanyName?.Value)
        {
            var companyNameResult = CompanyName.Create(companyName);
            if (companyNameResult.IsFailure)
                return Result.Failure(companyNameResult.Error);

            CompanyName = companyNameResult.Value;
            isUpdated = true;
        }

        var dateRangeResult = SetDateRange(startDate, endDate);

        if (dateRangeResult.IsFailure)
            return Result.Failure(dateRangeResult.Error);

        if (!string.IsNullOrWhiteSpace(description) && description != Description?.Value)
        {
            var descriptionResult = Description.Create(description);
            if (descriptionResult.IsFailure)
                return Result.Failure(descriptionResult.Error);

            Description = descriptionResult.Value;
            isUpdated = true;
        }

        if (isUpdated)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new ExperienceUpdatedDomainEvent(Id));
        }

        return Result.Success(this);
    }

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
