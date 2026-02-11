using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.SharedKernel.Domain;

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
        string firstName, 
        string lastName,
        string email, 
        string phoneNumber,
        string headLine, 
        string about, 
        string? photo) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        HeadLine = headLine;
        About = about;
        Photo = photo;
    }

    public string FirstName { get; private set; } = null!;
    public string LastName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string? PhoneNumber { get; private set; }
    public string HeadLine { get; private set; } = null!;
    public string About { get; private set; } = null!;
    public string? Photo { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Role Role { get; private set; }
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
