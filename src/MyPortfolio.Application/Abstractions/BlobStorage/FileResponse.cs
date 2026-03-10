namespace MyPortfolio.Application.Abstractions.BlobStorage;

public record FileResponse(
    Stream Stream,
    string ContentType,
    string FileName
);
