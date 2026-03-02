using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.DeleteEducation;

public sealed record DeleteEducationCommand(Guid Id) : ICommand<Guid>;