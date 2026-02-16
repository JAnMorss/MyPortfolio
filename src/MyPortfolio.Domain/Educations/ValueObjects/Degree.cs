using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Educations.ValueObjects;

public sealed class Degree : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 200;

    public Degree(string value)
    {
        Value = value;
    }

    public static Result<Degree> Create(string degree)
    {
        if (string.IsNullOrWhiteSpace(degree))
        {
            return Result.Failure<Degree>(new Error(
                "Degree.Empty",
                "Degree cannot be empty."));
        }

        if (degree.Length > MaxLength)
        {
            return Result.Failure<Degree>(new Error(
                "Degree.TooLong",
                $"Degree is too long. Maximum length is {MaxLength} characters."));
        }

        return new Degree(degree);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

}
