using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Users.ValueObjects;

public sealed class FirstName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 50;

    public FirstName(string value)
    {
        Value = value;
    }

    public static Result<FirstName> Create(string firstName)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            return Result.Failure<FirstName>(new Error(
                "firstName.Empty",
                "FirstName cannot be empty."));
        }

        if (firstName.Length > MaxLength)
        {
            return Result.Failure<FirstName>(new Error(
                "FirstName.TooLong",
                $"Firstname is too long. Maximum Length is {MaxLength} characters."
            ));
        }

        return new FirstName(firstName);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

}
