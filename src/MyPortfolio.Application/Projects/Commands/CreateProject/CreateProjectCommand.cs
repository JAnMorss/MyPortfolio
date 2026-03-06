using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.CreateProject;

public sealed record CreateProjectCommand(
    string Title,
    string? Description,
    string Techstack,
    string? Link,
    Guid UserId
) : ICommand<ProjectResponse>;
