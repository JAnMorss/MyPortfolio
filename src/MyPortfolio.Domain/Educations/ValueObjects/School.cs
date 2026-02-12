using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Educations.ValueObjects;

public sealed class School :ValueObject
{
    public string Value { get; }
    public const int MaxLength = 200;

    public School(string value)
    {
        Value = value;
    }

    public static Result<School> Update(string school)
    {
        if (string.IsNullOrWhiteSpace(school))
        {
            return Result.Failure<School>(new Error(
                "School.Empty",
                "School cannot be empty."));
        }

        if (school.Length > MaxLength)
        {
            return Result.Failure<School>(new Error(
                "School.TooLong",
                $"School is too long. Maximum length is {MaxLength} characters."));
        }

        return new School(school);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

}
