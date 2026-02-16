using MyPortfolio.SharedKernel.Domain;
using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Common.ValueObjects;

public sealed class Photo : ValueObject
{
    public string Value { get; }

    public Photo(string value)
    {
        Value = value;
    }


    public static Result<Photo> Create(string photo)
    {
        if (!Uri.TryCreate(photo, UriKind.Absolute, out var uriResult) ||
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            return Result.Failure<Photo>(new Error(
                "Photo.InvalidUrl",
                "Invalid photo URL."));
        }

        return new Photo(photo);
    }

    public static Guid? ExtractFileIdFromUrl(string url)
    {
        try
        {
            var segments = new Uri(url).Segments;
            if (segments.Length == 0) return null;

            var fileName = segments.Last().Trim('/');
            return Guid.TryParse(fileName, out var fileId) ? fileId : null;
        }
        catch
        {
            return null;
        }
    }

    public override IEnumerable<object> GetAtomicValues()
    {
        yield return Value;
    }
}
