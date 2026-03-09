using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.DeleteProject;

public sealed record DeleteProjectCommand(Guid Id) : ICommand;