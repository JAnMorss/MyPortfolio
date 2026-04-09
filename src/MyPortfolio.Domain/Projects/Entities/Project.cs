using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Events;
using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.Entities;

public sealed class Project : BaseEntity
{
    private readonly List<Photo> _media = new();
    private Project() { }
    public Project(
        Guid id,
        Title title,
        Description? description,
        Techstack techstack,
        Link? link,
        Guid userId) : base(id)
    {
        Title = title;
        Description = description;
        Techstack = techstack;
        Link = link;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public Title Title { get; private set; } = null!;
    public Description? Description { get; private set; }
    public Techstack Techstack { get; private set; } = null!;
    public Link? Link { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public IReadOnlyCollection<Photo> Media => _media.AsReadOnly();

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

    public Result AddMedia(IEnumerable<string> mediaUrls)
    {
        foreach (var url in mediaUrls)
        {
            var result = Photo.Create(url);
            if (result.IsFailure)
                return Result.Failure(result.Error);

            _media.Add(result.Value);
        }

        UpdatedAt = DateTime.UtcNow;
        RaiseDomainEvent(new AddMediaDomainEvent(Id));

        return Result.Success();
    }

    public Result RemoveMedia(string url)
    {
        var media = _media.FirstOrDefault(x => x.Value == url);
        if (media is null)
            return Result.Failure(new Error("Media.NotFound", "Media not found"));

        _media.Remove(media);

        UpdatedAt = DateTime.UtcNow;
        return Result.Success();
    }

}
