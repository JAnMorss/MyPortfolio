using MyPortfolio.Domain.Experiences.Entities;

namespace MyPortfolio.Application.Experiences.Responses;

public sealed class ExperienceResponse
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }

    public static ExperienceResponse FromEntity(Experience experience)
    {
        return new ExperienceResponse
        {
            Id = experience.Id,
            CompanyName = experience.CompanyName?.Value ?? string.Empty,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate,
            Description = experience.Description?.Value,
            CreatedAt = experience.CreatedAt,
            UpdatedAt = experience.UpdatedAt,
            UserId = experience.UserId
        };
    }
}
