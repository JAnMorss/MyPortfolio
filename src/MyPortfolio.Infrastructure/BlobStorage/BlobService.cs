using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MyPortfolio.Application.Abstractions.BlobStorage;

namespace MyPortfolio.Infrastructure.BlobStorage;

internal sealed class BlobService(BlobServiceClient blobServiceClient) : IBlobService
{
    public async Task DeleteAsync(
        string container,
        Guid fileId, 
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(container);

        var blobClient = containerClient.GetBlobClient(fileId.ToString());

        await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }

    public async Task<FileResponse> DownloadAsync(
        string container,
        Guid fileId, 
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(container);

        var blobClient = containerClient.GetBlobClient(fileId.ToString());

        var response = await blobClient.DownloadContentAsync(cancellationToken: cancellationToken);

        return new FileResponse(
            response.Value.Content.ToStream(),
            response.Value.Details.ContentType ?? "application/octet-stream",
            fileId.ToString()
        );
    }

    public string GetBlobUri(string container, Guid fileId)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(container);

        var blobClient = containerClient.GetBlobClient(fileId.ToString());

        return blobClient.Uri.ToString();
    }

    public async Task<Guid> UploadAsync(
        string container,
        Stream stream, 
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(container);

        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);

        var fileId = Guid.NewGuid();

        var blobClient = containerClient.GetBlobClient(fileId.ToString());

        await blobClient.UploadAsync(
            stream,
            new BlobHttpHeaders { ContentType = contentType },
            cancellationToken: cancellationToken);

        return fileId;
    }
}
