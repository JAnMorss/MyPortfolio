using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Common.ValueObjects;

public sealed class PersonName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 150;

    public PersonName(string value)
    {
        Value = value;
    }

    public static Result<PersonName> Create(string personName)
    {
        if (string.IsNullOrWhiteSpace(personName))
        {
            return Result.Failure<PersonName>(new Error(
                "PersonName.Empty",
                "PersonName cannot be empty."));
        }

        if (personName.Length > MaxLength)
        {
            return Result.Failure<PersonName>(new Error(
                "PersonName.TooLong",
                $"PersonName is too long. Maximum length is {MaxLength} characters."));
        }

        return new PersonName(personName);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
