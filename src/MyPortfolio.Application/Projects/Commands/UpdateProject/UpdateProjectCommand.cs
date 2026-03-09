using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.UpdateProject;

public sealed record UpdateProjectCommand(
    Guid Id,
    string Title,
    string? Description,
    string Techstack,
    string? Link
) : ICommand<ProjectResponse>;