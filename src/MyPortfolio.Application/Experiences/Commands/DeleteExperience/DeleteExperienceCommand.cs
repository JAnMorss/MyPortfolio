using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.DeleteExperience;

public sealed record DeleteExperienceCommand(Guid Id) : ICommand;
