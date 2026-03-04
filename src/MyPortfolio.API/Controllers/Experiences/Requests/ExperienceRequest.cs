namespace MyPortfolio.API.Controllers.Experiences.Requests;

public sealed record ExperienceRequest(
    string CompanyName,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description
);