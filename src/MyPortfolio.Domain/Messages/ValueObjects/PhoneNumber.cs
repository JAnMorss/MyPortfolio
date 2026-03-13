using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Messages.ValueObjects;

public sealed class PhoneNumber : ValueObject
{
    public string Value { get; }

    public const int MaxLength = 16;
    private const int MinDigits = 10;
    private const int MaxDigits = 15;

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static Result<PhoneNumber> Create(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return Result.Failure<PhoneNumber>(new Error(
                "PhoneNumber.Empty",
                "Phone number cannot be empty."));
        }

        phoneNumber = phoneNumber.Trim();

        var digits = new string(phoneNumber
            .Where(char.IsDigit)
            .ToArray());

        if (digits.Length < MinDigits || digits.Length > MaxDigits)
        {
            return Result.Failure<PhoneNumber>(new Error(
                "PhoneNumber.InvalidLength",
                $"Phone number must be between {MinDigits} and {MaxDigits} digits."));
        }

        return new PhoneNumber("+" + digits);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
