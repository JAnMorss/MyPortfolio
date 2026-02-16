using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Projects.Entities;

public sealed class Project : BaseEntity
{
    private Project() { }

    public Project(
        Guid id,
        Title title,
        Description? description,
        Techstack techstack,
        Link? link,
        Photo? imageUrl, 
        Guid userId) : base(id)
    {
        Title = title;
        Description = description;
        Techstack = techstack;
        Link = link;
        ImageUrl = imageUrl;
        UserId = userId;
    }

    public Title Title { get; private set; } = null!;
    public Description? Description { get; private set; }
    public Techstack Techstack { get; private set; } = null!;
    public Link? Link { get; private set; }
    public Photo? ImageUrl { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
