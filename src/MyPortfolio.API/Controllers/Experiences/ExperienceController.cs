using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Experiences.Queries.GetAllExperiences;
using MyPortfolio.Application.Experiences.Queries.GetExperienceById;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.API.Controllers.Experiences;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/experience")]
[Authorize]
public class ExperienceController : ApiController
{
    public ExperienceController(ISender sender)
        : base(sender)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAllExperiences(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if(userId is null)
            return Unauthorized();

        var query = new GetAllExperiencesQuery(queryObject, userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ExperienceResponse>>(
                result.Value,
                "Experiences retrieved successfully."))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetExperienceById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetExperienceByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ExperienceResponse>(
                result.Value,
                "Fetching experience by id is successfull."))
            : HandleFailure(result);
    }
}
