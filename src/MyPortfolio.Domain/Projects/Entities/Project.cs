using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Experiences.ValueObjects;
using MyPortfolio.Domain.Projects.Events;
using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

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
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public Title Title { get; private set; } = null!;
    public Description? Description { get; private set; }
    public Techstack Techstack { get; private set; } = null!;
    public Link? Link { get; private set; }
    public Photo? ImageUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Result Update(
        string title,
        string? description,
        string techstack,
        string? link)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(title) && title != Title?.Value)
        {
            var titleResult = Title.Create(title);
            if (titleResult.IsFailure)
                return Result.Failure(titleResult.Error);

            Title = titleResult.Value;
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

        if (!string.IsNullOrWhiteSpace(techstack) && techstack != Techstack?.Value)
        {
            var techstackResult = Techstack.Create(techstack);
            if (techstackResult.IsFailure)
                return Result.Failure(techstackResult.Error);

            Techstack = techstackResult.Value;
            isUpdated = true;
        }

        if (!string.IsNullOrWhiteSpace(link) && link != Link?.Value)
        {
            var linkResult = Link.Create(link);
            if (linkResult.IsFailure)
                return Result.Failure(linkResult.Error);

            Link = linkResult.Value;
            isUpdated = true;
        }

        if(isUpdated)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new ProjectUpdatedDomainEvent(Id));
        }

        return Result.Success(this);
    }
}
