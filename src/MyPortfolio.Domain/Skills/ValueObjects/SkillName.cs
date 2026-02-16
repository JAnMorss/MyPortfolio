using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Skills.ValueObjects;

public sealed class SkillName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 50;

    public SkillName(string value)
    {
        Value = value;
    }

    public static Result<SkillName> Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result.Failure<SkillName>(new Error(
                "SkillName.Empty",
                "SkillName cannot be empty."));
        }

        if (title.Length > MaxLength)
        {
            return Result.Failure<SkillName>(new Error(
                "SkillName.TooLong",
                $"SkillName is too long. Maximum length is {MaxLength} characters."));
        }

        return new SkillName(title);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
