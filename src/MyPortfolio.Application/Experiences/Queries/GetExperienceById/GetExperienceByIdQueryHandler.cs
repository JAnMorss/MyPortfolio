using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.Domain.Experiences.Errors;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Experiences.Queries.GetExperienceById;

public sealed class GetExperienceByIdQueryHandler
    : IQueryHandler<GetExperienceByIdQuery, ExperienceResponse>
{
    private readonly IExperienceRepository _experienceRepository;

    public GetExperienceByIdQueryHandler(IExperienceRepository experienceRepository)
    {
        _experienceRepository = experienceRepository;
    }

    public async Task<Result<ExperienceResponse>> Handle(
        GetExperienceByIdQuery request, 
        CancellationToken cancellationToken)
    {
        var experience = await _experienceRepository.GetByIdAsync(request.Id, cancellationToken);
        if(experience is null)
            return Result.Failure<ExperienceResponse>(ExperienceErrors.NotFound);

        return Result.Success(ExperienceResponse.FromEntity(experience));
    }
}
