using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Errors;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Skills.Queries.GetSkillById;

public sealed class GetSkillByIdQueryHandler 
    : IQueryHandler<GetSkillByIdQuery, SkillResponse>
{
    private readonly ISkillRepository _skillRepository;

    public GetSkillByIdQueryHandler(ISkillRepository skillRepository)
    {
        _skillRepository = skillRepository;
    }

    public async Task<Result<SkillResponse>> Handle(
        GetSkillByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var skill = await _skillRepository.GetByIdAsync(request.Id, cancellationToken);
        if(skill is null)
            return Result.Failure<SkillResponse>(SkillErrors.NotFound);

        return Result.Success(SkillResponse.FromEntity(skill));
    }
}
