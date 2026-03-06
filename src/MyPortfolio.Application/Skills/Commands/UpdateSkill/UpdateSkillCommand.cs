using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Enums;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.UpdateSkill;

public sealed record UpdateSkillCommand(
    Guid Id,
    string SkillName,
    Level? Level
) : ICommand<SkillResponse>;
