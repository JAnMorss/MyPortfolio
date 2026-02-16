using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Common.ValueObjects;

public sealed class Description : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;

    public Description(string value)
    {
        Value = value;
    }

    public static Result<Description> Create(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return Result.Failure<Description>(new Error(
                "Description.Empty",
                "Description cannot be empty."));
        }

        if (description.Length > MaxLength)
        {
            return Result.Failure<Description>(new Error(
                "Description.TooLong",
                $"Description is too long. Maximum length is {MaxLength} characters."));
        }

        return new Description(description);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
