using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Messages.ValueObjects;

public sealed class PhoneNumber : ValueObject
{
    public string Value { get; }

    public const int MaxLength = 16;
    private const int MinDigits = 10;
    private const int MaxDigits = 15;

    public PhoneNumber(string value)
    {
        Value = value;
    }

    public static Result<PhoneNumber> Create(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return Result.Failure<PhoneNumber>(new Error(
                "PhoneNumber.Empty",
                "PhoneNumber cannot be empty."));
        }

        var normalized = phoneNumber.Trim();

        normalized = normalized.Replace(" ", "")
                           .Replace("-", "")
                           .Replace("(", "")
                           .Replace(")", "")
                           .Replace("+", "");

        if (!normalized.All(char.IsDigit))
        {
            return Result.Failure<PhoneNumber>(new Error(
                "PhoneNumber.Invalid",
                "Phone number must contain only digits."));
        }

        if (normalized.Length < MinDigits || normalized.Length > MaxDigits)
        {
            return Result.Failure<PhoneNumber>(new Error(
                "PhoneNumber.InvalidLength",
                $"Phone number must be between {MinDigits} and {MaxDigits} digits."));
        }

        return new PhoneNumber("+" + normalized);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
