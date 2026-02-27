using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Helpers;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Educations.Queries.GetAllEducations;

public sealed class GetAllEducationsQueryHandler : IQueryHandler<GetAllEducationsQuery, PaginatedResult<EducationResponse>>
{
    private readonly IEducationRepository _educationRepository;

    public GetAllEducationsQueryHandler(IEducationRepository educationRepository)
    {
        _educationRepository = educationRepository;
    }

    public async Task<Result<PaginatedResult<EducationResponse>>> Handle(
        GetAllEducationsQuery request,
        CancellationToken cancellationToken)
    {
        var query = request.Query ?? new QueryObject();

        var educations = await _educationRepository.GetAllAsync(query, cancellationToken);
        if(educations is null)
            return Result.Failure<PaginatedResult<EducationResponse>>(EducationErrors.NotFound);

        var mapped = educations
            .Select(EducationResponse.FromEntity)
            .ToList();

        var totalCount = await _educationRepository.CountAsync(request.UserId, cancellationToken);

        var result = new PaginatedResult<EducationResponse>(
            mapped,
            totalCount,
            query.Page,
            query.PageSize
        );

        return Result.Success(result);
    }
}
