using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.ValueObjects;

public sealed class Techstack : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 500;

    public Techstack(string value)
    {
        Value = value;
    }

    public static Result<Techstack> Create(string techstack)
    {
        if (string.IsNullOrWhiteSpace(techstack))
        {
            return Result.Failure<Techstack>(new Error(
                "Techstack.Empty",
                "Techstack cannot be empty."));
        }

        if (techstack.Length > MaxLength)
        {
            return Result.Failure<Techstack>(new Error(
                "Techstack.TooLong",
                $"Techstack is too long. Maximum length is {MaxLength} characters."));
        }

        return new Techstack(techstack);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
