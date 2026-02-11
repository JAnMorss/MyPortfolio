using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Projects.Entities;

public sealed class Project : BaseEntity
{
    private Project() { }

    public Project(
        Guid id, 
        string title, 
        string? description, 
        string techstack, 
        string? link,
        string? imageUrl, 
        Guid userId) : base(id)
    {
        Title = title;
        Description = description;
        Techstack = techstack;
        Link = link;
        ImageUrl = imageUrl;
        UserId = userId;
    }

    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public string Techstack { get; private set; } = null!;
    public string? Link { get; private set; }
    public string? ImageUrl { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
