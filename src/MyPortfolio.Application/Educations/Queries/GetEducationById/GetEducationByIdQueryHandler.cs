using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Educations.Queries.GetEducationById;

public sealed class GetEducationByIdQueryHandler : IQueryHandler<GetEducationByIdQuery, EducationResponse>
{
    private readonly IEducationRepository _educationRepository;

    public GetEducationByIdQueryHandler(IEducationRepository educationRepository)
    {
        _educationRepository = educationRepository;
    }

    public async Task<Result<EducationResponse>> Handle(
        GetEducationByIdQuery request,
        CancellationToken cancellationToken
    )
    {
        var education = await _educationRepository.GetByIdAsync(request.Id, cancellationToken);
        if(education is null)
            return Result.Failure<EducationResponse>(EducationErrors.NotFound);

        return EducationResponse.FromEntity(education);
    }
}
