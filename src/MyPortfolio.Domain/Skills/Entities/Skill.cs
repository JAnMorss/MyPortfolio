using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.Domain.Skills.Enums;
using MyPortfolio.Domain.Skills.Events;
using MyPortfolio.Domain.Skills.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

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
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;
    }

    public SkillName SkillName { get; private set; } = null!;
    public Level? Level { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    public Result Update(
        string skillName,
        Level? level)
    {
        bool isUpdated = false;

        if(!string.IsNullOrWhiteSpace(skillName) && skillName != SkillName?.Value)
        {
            var skillNameResult = SkillName.Create(skillName);
            if (skillNameResult.IsFailure)
                return Result.Failure(skillNameResult.Error);

            SkillName = skillNameResult.Value;

            isUpdated = true;
        }

        if(level != Level)
        {
            Level = level;

            isUpdated = true;
        }

        if (isUpdated)
        {
            UpdatedAt = DateTime.UtcNow;
            RaiseDomainEvent(new SkillUpdatedDomainEvent(Id));
        }

        return Result.Success(this);
    }
}
