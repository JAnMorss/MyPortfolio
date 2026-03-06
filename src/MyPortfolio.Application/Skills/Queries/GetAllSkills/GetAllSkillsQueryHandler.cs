using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Errors;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Skills.Queries.GetAllSkills;

public sealed class GetAllSkillsQueryHandler
    : IQueryHandler<GetAllSkillsQuery, PaginatedResult<SkillResponse>>
{
    private readonly ISkillRepository _skillRepository;

    public GetAllSkillsQueryHandler(ISkillRepository skillRepository)
    {
        _skillRepository = skillRepository;
    }

    public async Task<Result<PaginatedResult<SkillResponse>>> Handle(
        GetAllSkillsQuery request,
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();
        
        var skills = await _skillRepository.GetAllAsync(query, cancellationToken);
        if(skills is null)
            return Result.Failure<PaginatedResult<SkillResponse>>(SkillErrors.NotFound);

        var mapped = skills
            .Select(SkillResponse.FromEntity)
            .ToList();

        var totalCount = await _skillRepository.CountAsync(request.UserId, cancellationToken);

        var result = new PaginatedResult<SkillResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize
        );

        return Result.Success(result);
    }
}
