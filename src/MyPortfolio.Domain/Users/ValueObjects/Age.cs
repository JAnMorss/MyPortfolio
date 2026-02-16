using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Users.ValueObjects;

public sealed class Age : ValueObject
{
    public int Value { get; }

    public const int MinAge = 0;
    public const int MaxAge = 100;

    public Age(int value)
    {
        Value = value;
    }

    public static Result<Age> Create(int age)
    {
        if (age < MinAge)
        {
            return Result.Failure<Age>(new Error(
                "Age.TooLow",
                $"Age cannot be less than {MinAge}."));
        }

        if (age > MaxAge)
        {
            return Result.Failure<Age>(new Error(
                "Age.TooHigh",
                $"Age cannot be greater than {MaxAge}."));
        }

        return new Age(age);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
