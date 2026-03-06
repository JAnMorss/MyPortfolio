using MyPortfolio.Domain.Projects.Entities;

namespace MyPortfolio.Application.Projects.Responses;

public sealed class ProjectResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string Techstack { get; set; } = null!;
    public string? Link { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }

    public static ProjectResponse FromEntity(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Title = project.Title?.Value ?? string.Empty,
            Description = project.Description?.Value,
            Techstack = project.Techstack?.Value ?? string.Empty,
            Link = project.Link?.Value,
            ImageUrl = project.ImageUrl?.Value,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt,
            UserId = project.UserId,
        };

    }
}
