using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Users.ValueObjects;

public sealed class HeadLine : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 200;

    public HeadLine(string value)
    {
        Value = value;
    }

    public static Result<HeadLine> Create(string headLine)
    {
        if (string.IsNullOrWhiteSpace(headLine))
        {
            return Result.Failure<HeadLine>(new Error(
                "HeadLine.Empty",
                "HeadLine cannot be empty."));
        }

        if (headLine.Length > MaxLength)
        {
            return Result.Failure<HeadLine>(new Error(
                "HeadLine.TooLong",
                $"HeadLine is too long. Maximum Length is {MaxLength} characters."
            ));
        }

        return new HeadLine(headLine);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }

}
