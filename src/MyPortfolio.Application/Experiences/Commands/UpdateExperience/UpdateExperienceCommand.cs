using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.UpdateExperience;

public sealed record UpdateExperienceCommand(
    Guid Id,
    string CompanyName,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description
) : ICommand<ExperienceResponse>;