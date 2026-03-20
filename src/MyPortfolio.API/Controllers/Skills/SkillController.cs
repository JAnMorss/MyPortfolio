using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.Skills.Requests;
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Skills.Commands.CreateSkill;
using MyPortfolio.Application.Skills.Commands.DeleteSkill;
using MyPortfolio.Application.Skills.Commands.UpdateSkill;
using MyPortfolio.Application.Skills.Queries.GetAllSkills;
using MyPortfolio.Application.Skills.Queries.GetSkillById;
using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.SharedKernel.Helpers;

namespace MyPortfolio.API.Controllers.Skills;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/skill")]
[Authorize(Roles = "Admin")]
public class SkillController : ApiController
{
    public SkillController(ISender sender)
        : base(sender)
    {
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllSkills(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllSkillsQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<SkillResponse>>(
                result.Value,
                "Skill retrieved successfully."))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSkillById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetSkillByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<SkillResponse>(
                result.Value,
                "Fetching skill by id is successfull."))
            : HandleFailure(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddSkill(
        [FromBody] SkillRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new CreateSkillCommand(
            request.SkillName,
            request.Level,
            userId.Value
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<SkillResponse>(
                result.Value,
                "Skill added successfully."))
            : HandleFailure(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSkill(
        [FromRoute] Guid id,
        [FromBody] SkillRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateSkillCommand(
            id,
            request.SkillName,
            request.Level
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<SkillResponse>(
                result.Value,
                "Skill updated successfully."))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSkill(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteSkillCommand(id);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Skill deleted successfully."))
            : HandleFailure(result);
    }
}
