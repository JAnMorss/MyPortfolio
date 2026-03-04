using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.CreateExperience;

public sealed record CreateExperienceCommand(
    string CompanyName,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description,
    Guid UserId
) : ICommand<ExperienceResponse>;
