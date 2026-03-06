using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.DeleteSkill;

public sealed record DeleteSkillCommand(Guid Id) : ICommand;