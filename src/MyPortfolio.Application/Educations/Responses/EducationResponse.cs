using MyPortfolio.Domain.Educations.Entities;

namespace MyPortfolio.Application.Educations.Responses;

public sealed class EducationResponse
{
    public Guid Id { get; set; }
    public string? School { get; set; }
    public string? Degree { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }

    public static EducationResponse FromEntity(Education education)
    {
        return new EducationResponse
        {
            Id = education.Id,
            School = education.School?.Value,
            Degree = education.Degree?.Value,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            Description = education.Description?.Value,
            CreatedAt = education.CreatedAt,
            UpdatedAt = education.UpdatedAt,
            UserId = education.UserId
        };
    }
}
