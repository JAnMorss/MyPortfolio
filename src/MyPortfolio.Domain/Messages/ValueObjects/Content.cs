using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Messages.ValueObjects;

public sealed class Content : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 1000;

    public Content(string value)
    {
        Value = value;
    }

    public static Result<Content> Create(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return Result.Failure<Content>(new Error(
                "Content.Empty",
                "Content cannot be empty."));
        }

        if (content.Length > MaxLength)
        {
            return Result.Failure<Content>(new Error(
                "Content.TooLong",
                $"Content is too long. Maximum length is {MaxLength} characters."));
        }

        return new Content(content);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
