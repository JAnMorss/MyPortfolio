using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.Domain.Users.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using System.Net.Mail;

namespace MyPortfolio.Domain.Users.Entities;

public sealed class User : BaseEntity
{
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<Education> _educations = new();
    private readonly List<Experience> _experiences = new();
    private readonly List<Project> _projects = new();
    private readonly List<Skill> _skills = new();

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

    public Guid RoleId { get; private set; }
    public Role Role { get; private set; } = null!;

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

}
