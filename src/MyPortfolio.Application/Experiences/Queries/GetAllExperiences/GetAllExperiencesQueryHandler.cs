using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.Domain.Experiences.Errors;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Experiences.Queries.GetAllExperiences;

public sealed class GetAllExperiencesQueryHandler
    : IQueryHandler<GetAllExperiencesQuery, PaginatedResult<ExperienceResponse>>
{
    private readonly IExperienceRepository _experienceRepository;

    public GetAllExperiencesQueryHandler(IExperienceRepository experienceRepository)
    {
        _experienceRepository = experienceRepository;
    }

    public async Task<Result<PaginatedResult<ExperienceResponse>>> Handle(
        GetAllExperiencesQuery request,
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var experiences = await _experienceRepository.GetAllAsync(query, cancellationToken);
        if(experiences is null)
            return Result.Failure<PaginatedResult<ExperienceResponse>>(ExperienceErrors.NotFound);

        var mapped = experiences
            .Select(ExperienceResponse.FromEntity)
            .ToList();

        var totalCount = await _experienceRepository.CountAsync(cancellationToken);

        var result = new PaginatedResult<ExperienceResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize
        );

        return Result.Success(result);
    }
}
