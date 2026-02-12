using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Users.ValueObjects;

public sealed class About : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;

    public About(string value)
    {
        Value = value;
    }

    public static Result<About> Update(string about)
    {
        if (string.IsNullOrWhiteSpace(about))
        {
            return Result.Failure<About>(new Error(
                "About.Empty",
                "About cannot be empty."));
        }

        if (about.Length > MaxLength)
        {
            return Result.Failure<About>(new Error(
                "About.TooLong",
                $"About is too long. Maximum Length is {MaxLength} characters."
            ));
        }

        return new About(about);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

    public override string ToString()
        => Value.ToString();
}
