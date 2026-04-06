using MyPortfolio.Domain.Projects.Entities;

namespace MyPortfolio.Application.Projects.Responses;

public sealed class ProjectMediaResponse
{
    public string? MediaUrl { get; init; } = string.Empty;

    public byte[]? ImageBytes { get; init; }

    public string? ContentType { get; init; }

    public static ProjectMediaResponse FromEntity(
        Project project,
        byte[]? imageBytes = null,
        string? contentType = null)
    {
        return new ProjectMediaResponse
        {
            MediaUrl = project.MediaUrl?.Value,
            ImageBytes = imageBytes,
            ContentType = contentType
        };
    }
}
