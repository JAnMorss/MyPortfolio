using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Testimonials.ValueObjects;

public sealed class Quote : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;

    public Quote(string value)
    {
        Value = value;
    }

    public static Result<Quote> Create(string quote)
    {
        if (string.IsNullOrWhiteSpace(quote))
        {
            return Result.Failure<Quote>(new Error(
                "Quote.Empty",
                "Quote cannot be empty."));
        }

        if (quote.Length > MaxLength)
        {
            return Result.Failure<Quote>(new Error(
                "Quote.TooLong",
                $"Quote is too long. Maximum length is {MaxLength} characters."));
        }

        return new Quote(quote);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
