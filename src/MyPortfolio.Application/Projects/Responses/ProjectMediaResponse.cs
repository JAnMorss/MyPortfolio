using MyPortfolio.Domain.Projects.Entities;

namespace MyPortfolio.Application.Projects.Responses;

public sealed class ProjectMediaResponse
{
    public List<string> MediaUrls { get; init; } = new();

    public static ProjectMediaResponse FromEntity(Project project)
    {
        return new ProjectMediaResponse
        {
            MediaUrls = project.Media
                .Select(m => m.Value)
                .ToList()
        };
    }
}