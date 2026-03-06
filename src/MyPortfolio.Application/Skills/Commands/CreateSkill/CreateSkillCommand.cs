using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Enums;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.CreateSkill;

public sealed record CreateSkillCommand(
    string SkillName,
    Level? Level,
    Guid UserId
) : ICommand<SkillResponse>;