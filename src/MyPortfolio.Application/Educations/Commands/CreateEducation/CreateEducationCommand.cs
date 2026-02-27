using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.CreateEducation;

public sealed record CreateEducationCommand(
    string School,
    string Degree,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description,
    Guid UserId
) : ICommand<EducationResponse>;