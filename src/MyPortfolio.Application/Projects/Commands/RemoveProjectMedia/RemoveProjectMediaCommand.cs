using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.RemoveProjectMedia;

public sealed record RemoveProjectMediaCommand(
    Guid ProjectId,
    string MediaUrl
) : ICommand;
