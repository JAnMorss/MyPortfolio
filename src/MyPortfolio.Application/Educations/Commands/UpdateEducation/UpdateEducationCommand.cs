using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.UpdateEducation;

public sealed record UpdateEducationCommand(
    Guid Id,
    string School,
    string Degree,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Description
) : ICommand<EducationResponse>;
