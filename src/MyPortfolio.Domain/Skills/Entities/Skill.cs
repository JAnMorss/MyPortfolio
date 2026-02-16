using MyPortfolio.Domain.Skills.Enums;
using MyPortfolio.Domain.Skills.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Skills.Entities;

public sealed class Skill : BaseEntity
{
    private Skill() { }

    public Skill(
        Guid id,
        SkillName skillName,
        Level? level, 
        Guid userId) : base(id)
    {
        SkillName = skillName;
        Level = level;
        UserId = userId;
    }

    public SkillName SkillName { get; private set; } = null!;
    public Level? Level { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
}
