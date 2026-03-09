namespace MyPortfolio.API.Controllers.Projects.Requests;

public sealed record ProjectRequest(
    string Title,
    string? Description,
    string Techstack,
    string? Link
);