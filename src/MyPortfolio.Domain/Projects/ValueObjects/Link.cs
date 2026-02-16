using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.ValueObjects;

public sealed class Link : ValueObject
{
    public const int MaxLength = 2048;

    public string Value { get; }

    private Link(string value)
    {
        Value = value;
    }

    public static Result<Link> Create(string link)
    {
        if (string.IsNullOrWhiteSpace(link))
        {
            return Result.Failure<Link>(new Error(
                "Link.Empty",
                "Link cannot be empty."));
        }

        link = link.Trim();

        if (link.Length > MaxLength)
        {
            return Result.Failure<Link>(new Error(
                "Link.TooLong",
                $"Link is too long. Maximum length is {MaxLength} characters."));
        }

        if (!Uri.TryCreate(link, UriKind.Absolute, out var uriResult) ||
            (uriResult.Scheme != Uri.UriSchemeHttp &&
             uriResult.Scheme != Uri.UriSchemeHttps))
        {
            return Result.Failure<Link>(new Error(
                "Link.Invalid",
                "Link must be a valid HTTP or HTTPS URL."));
        }

        return new Link(link);
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
