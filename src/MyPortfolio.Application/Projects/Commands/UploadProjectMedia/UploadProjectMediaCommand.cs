using Microsoft.AspNetCore.Http;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.UploadProjectMedia;

public sealed record UploadProjectMediaCommand(
    Guid ProjectId,
    IEnumerable<IFormFile> Files
) : ICommand;