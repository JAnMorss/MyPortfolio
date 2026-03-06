using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.Errors;

public static class ProjectErrors
{
    public static readonly Error NotFound = new(
        "Project.NotFound",
        "The Project with the specified identifier was not found.");
}
