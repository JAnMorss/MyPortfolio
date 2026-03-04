using MyPortfolio.Domain.Skills.Entities;

namespace MyPortfolio.Application.Skills.Responses;

public sealed class SkillResponse
{
    public Guid Id { get; set; }
    public string SkillName { get; set; } = null!;
    public string? Level { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid UserId { get; set; }

    public static SkillResponse FromEntity(Skill skill)
    {
        return new SkillResponse
        {
            Id = skill.Id,
            SkillName = skill.SkillName.Value,
            Level = skill.Level.ToString(),
            CreatedAt = skill.CreatedAt,
            UpdatedAt = skill.UpdatedAt,
            UserId = skill.UserId
        };

    }

}
