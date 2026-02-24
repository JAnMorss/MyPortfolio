using MyPortfolio.Domain.Users.Entities;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace MyPortfolio.Application.UserProfile.Responses;

public sealed class UserResponse
{
    public Guid Id { get; init; }

    public string FullName { get; init; } = null!;

    public int Age { get; init; }

    public string Role { get; init; } = null!;

    [EmailAddress]
    public string? Email { get; init; }

    public string? Photo { get; init; }

    public string? HeadLine { get; init; }

    public string? About { get; init; }

    public DateTime? UpdatedAt { get; init; }

    public static UserResponse FromEntity(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FullName = $"{user.FirstName.Value} {user.LastName.Value}",
            Role = user.Roles.Any()
                ? string.Join(", ", user.Roles.Select(r => r.Name))
                : "User",
            Age = user.Age.Value,
            Email = user.Email?.Value,
            Photo = user.Photo?.Value,
            HeadLine = user.HeadLine?.Value,
            About = user.About?.Value,
            UpdatedAt = user.UpdatedAt
        };
    }
}