using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Skills.Queries.GetSkillById;

public sealed record GetSkillByIdQuery(Guid Id) : IQuery<SkillResponse>;
