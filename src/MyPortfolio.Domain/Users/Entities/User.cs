using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.Domain.Users.Events;
using MyPortfolio.Domain.Users.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Users.Entities;

public sealed class User : BaseEntity
{
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<Education> _educations = new();
    private readonly List<Experience> _experiences = new();
    private readonly List<Project> _projects = new();
    private readonly List<Skill> _skills = new();
    private readonly List<Role> _roles = new();

    private User() { }
    public User(
        Guid id,
        FirstName firstName,
        LastName lastName,
        Age age,
        EmailAddress email,
        HeadLine headLine,
        About about,
        Photo? photo,
        PasswordHash passwordHash) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = age;
        Email = email;
        HeadLine = headLine;
        About = about;
        Photo = photo;
        PasswordHash = passwordHash;
    }

    public FirstName FirstName { get; private set; } = null!;
    public LastName LastName { get; private set; } = null!;
    public Age Age { get; private set; } = null!;
    public EmailAddress Email { get; private set; } = null!;
    public HeadLine HeadLine { get; private set; } = null!;
    public About About { get; private set; } = null!;
    public Photo? Photo { get; private set; }
    public PasswordHash PasswordHash { get; private set; } = null!;
    public DateTime? UpdatedAt { get; private set; }

    public IReadOnlyCollection<Role> Roles
    => _roles.AsReadOnly();

    public IReadOnlyCollection<RefreshToken> RefreshTokens 
        => _refreshTokens.AsReadOnly();
    public IReadOnlyCollection<Education> Educations
        => _educations.AsReadOnly();
    public IReadOnlyCollection<Experience> Experiences 
        => _experiences.AsReadOnly();

    public IReadOnlyCollection<Project> Projects
        => _projects.AsReadOnly();

    public IReadOnlyCollection<Skill> Skills
        => _skills.AsReadOnly();

    public static Result<User> Create(
        FirstName firstName,
        LastName lastName,
        Age age,
        EmailAddress email,
        HeadLine headLine,
        About about,
        Photo? photo,
        PasswordHash passwordHash)
    {

        var user = new User(
            Guid.NewGuid(),
            firstName,
            lastName,
            age,
            email,
            headLine,
            about,
            photo,
            passwordHash);

        user._roles.Add(Role.Admin);

        user.RaiseDomainEvent(new UserCreateDomainEvent(user.Id));

        return Result.Success(user);
    }

    public Result<User> UpdateDetails(
        FirstName firstName,
        LastName lastName,
        Age age,
        EmailAddress email,
        HeadLine headLine,
        About about)
    {
        bool changed = false;

        if (!string.IsNullOrWhiteSpace(firstName.Value) && firstName != FirstName)
        {
            FirstName = firstName;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(lastName.Value) && lastName != LastName)
        {
            LastName = lastName;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(age.ToString()) && age != Age)
        {
            Age = age;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(email.Value) && email != Email)
        {
            Email = email;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(headLine.Value) && headLine != HeadLine)
        {
            HeadLine = headLine;
            changed = true;
        }

        if (!string.IsNullOrWhiteSpace(about.Value) && about != About)
        {
            About = about;
            changed = true;
        }

        if (changed)
        {
            UpdatedAt = DateTime.UtcNow;

            RaiseDomainEvent(new UserUpdateDomainEvent(Id));
        }


        return Result.Success(this);
    }
     public Result<User> UpdatePassword(PasswordHash newPasswordHash)
     {
        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new UserUpdateDomainEvent(Id));

        return Result.Success(this);
     } 

    public Result UpdatePhoto(string photoUrl)
    {
        var photoResult = Photo.Create(photoUrl);
        if (photoResult.IsFailure)
            return Result.Failure(photoResult.Error);

        Photo = photoResult.Value;
        UpdatedAt = DateTime.UtcNow;

        RaiseDomainEvent(new UserAvatarUpdatedDomainEvent(Id));

        return Result.Success();
    }

    public void AddRefreshToken(RefreshToken refreshToken)
        => _refreshTokens.Add(refreshToken);
}
