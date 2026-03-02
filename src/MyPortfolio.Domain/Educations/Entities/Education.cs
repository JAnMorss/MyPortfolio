using MediatR;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.Events;
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
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;

        var result = SetDateRange(startDate, endDate);
    }

    public School School { get; private set; } = null!;
    public Degree Degree { get; private set; } = null!;
    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }
    public Description? Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Result UpdateEducation(
        string school,
        string degree,
        DateTime? startDate,
        DateTime? endDate,
        string? description)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(school) && school != School?.Value)
        {
            var schoolResult = School.Create(school);
            if (schoolResult.IsFailure)
                return Result.Failure(schoolResult.Error);

            School = schoolResult.Value;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(degree) && degree != Degree?.Value)
        {
            var degreeResult = Degree.Create(degree);
            if (degreeResult.IsFailure)
                return Result.Failure(degreeResult.Error);

            Degree = degreeResult.Value;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(description) && description != Description?.Value)
        {
            var descriptionResult = Description.Create(description);
            if (descriptionResult.IsFailure)
                return Result.Failure(descriptionResult.Error);

            Description = descriptionResult.Value;
            isUpdated = true;
        }

        var result = SetDateRange(startDate, endDate);

        if (isUpdated)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new EducationUpdatedDomainEvent(Id));
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
