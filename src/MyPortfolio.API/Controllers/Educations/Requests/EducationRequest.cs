namespace MyPortfolio.API.Controllers.Educations.Requests;

public sealed record EducationRequest(
    string School,
    string Degree,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description);
