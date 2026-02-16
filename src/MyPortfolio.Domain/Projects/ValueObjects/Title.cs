using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.ValueObjects;

public sealed class Title : ValueObject
{
    public string Value { get; }
    public const int MaxLength = 200;

    public Title(string value)
    {
        Value = value;
    }

    public static Result<Title> Create(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result.Failure<Title>(new Error(
                "Title.Empty",
                "Title cannot be empty."));
        }

        if (title.Length > MaxLength)
        {
            return Result.Failure<Title>(new Error(
                "Title.TooLong",
                $"Title is too long. Maximum length is {MaxLength} characters."));
        }

        return new Title(title);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
