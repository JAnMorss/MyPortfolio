using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.Educations.Requests;
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Educations.Commands.CreateEducation;
using MyPortfolio.Application.Educations.Commands.DeleteEducation;
using MyPortfolio.Application.Educations.Commands.UpdateEducation;
using MyPortfolio.Application.Educations.Queries.GetAllEducations;
using MyPortfolio.Application.Educations.Queries.GetEducationById;
using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.API.Controllers.Educations;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/educations")]
[Authorize]
public class EducationController : ApiController
{
    public EducationController(ISender sender)
        : base(sender)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEducations(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken
    )
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var query = new GetAllEducationsQuery(queryObject, userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<EducationResponse>>(
                result.Value,
                "Education fetched successfully."))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        [FromRoute] Guid id,
        CancellationToken cancellation
    )
    {
        var query = new GetEducationByIdQuery(id);

        var result = await _sender.Send(query, cancellation);

        return result.IsSuccess
            ? Ok(new ApiResponse<EducationResponse>(
                result.Value,
                "Fetching education by id is successfull."))
            : HandleFailure(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateEducation(
        [FromBody] EducationRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if(userId is null)
            return Unauthorized();

        var command = new CreateEducationCommand(
            request.School,
            request.Degree,
            request.StartDate,
            request.EndDate,
            request.Description,
            userId.Value);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<EducationResponse>(
                result.Value,
                "Education created successfully."))
            : HandleFailure(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEducation(
        [FromRoute] Guid id,
        [FromBody] EducationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateEducationCommand(
            id,
            request.School,
            request.Degree,
            request.StartDate,
            request.EndDate,
            request.Description);

        var result = await _sender.Send(command, cancellationToken);
        return result.IsSuccess
            ? Ok(new ApiResponse<EducationResponse>(
                result.Value,
                "Education updated successfully."))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEducation(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteEducationCommand(id);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Education deleted successfully."))
            : HandleFailure(result);
    }
}
