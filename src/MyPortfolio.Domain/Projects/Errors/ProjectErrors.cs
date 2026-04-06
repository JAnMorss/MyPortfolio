using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Projects.Errors;

public static class ProjectErrors
{
    public static readonly Error NotFound = new(
        "Project.NotFound",
        "The Project with the specified identifier was not found.");

    public static readonly Error MediaNotFound = new(
        "Project.MediaNotFound",
        "The media associated with the Project was not found.");

    public static readonly Error InvalidMedia = new(
        "Project.InvalidMedia",
        "The media URL associated with the Project is invalid.");
}
