using MyPortfolio.Domain.Skills.Enums;

namespace MyPortfolio.API.Controllers.Skills.Requests;

public sealed record SkillRequest(
    string SkillName,
    Level? Level
);
