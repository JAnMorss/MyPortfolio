using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Skills.Errors;

public static class SkillErrors
{
    public static readonly Error NotFound = new(
        "Skill.NotFound",
        "The Skill with the specified identifier was not found."
    );
}
