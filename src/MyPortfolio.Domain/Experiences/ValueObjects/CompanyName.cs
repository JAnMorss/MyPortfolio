using MyPortfolio.Domain.Users.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Experiences.ValueObjects;

public sealed class CompanyName : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 200;

    public CompanyName(string value)
    {
        Value = value;
    }

    public static Result<CompanyName> Create(string companyName)
    {
        if (string.IsNullOrWhiteSpace(companyName))
        {
            return Result.Failure<CompanyName>(new Error(
                "CompanyName.Empty",
                "CompanyName cannot be empty."));
        }

        if (companyName.Length > MaxLength)
        {
            return Result.Failure<CompanyName>(new Error(
                "CompanyName.TooLong",
                $"CompanyName is too long. Maximum Length is {MaxLength} characters."
            ));
        }

        return new CompanyName(companyName);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

}
