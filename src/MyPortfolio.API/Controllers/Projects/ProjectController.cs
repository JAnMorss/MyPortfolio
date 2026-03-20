using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.Projects.Requests;
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Projects.Commands.CreateProject;
using MyPortfolio.Application.Projects.Commands.DeleteProject;
using MyPortfolio.Application.Projects.Commands.UpdateProject;
using MyPortfolio.Application.Projects.Commands.UploadProjectMedia;
using MyPortfolio.Application.Projects.Queries.GetAllProjects;
using MyPortfolio.Application.Projects.Queries.GetProjectById;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.SharedKernel.Helpers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MyPortfolio.API.Controllers.Projects;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/project")]
[Authorize(Roles = "Admin")]
public class ProjectController : ApiController
{
    public ProjectController(ISender sender)
        : base(sender)
    {
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllProjects(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {

        var query = new GetAllProjectsQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<ProjectResponse>>(
                result.Value,
                "Project retrieved successfully."))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProjectById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetProjectByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Fetching project by Id is successfull."))
            : HandleFailure(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddProject(
        [FromBody] ProjectRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new CreateProjectCommand(
            request.Title,
            request.Description,
            request.Techstack,
            request.Link,
            userId.Value
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Project added successfully."))
            : HandleFailure(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(
        [FromRoute] Guid id,
        [FromBody] ProjectRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProjectCommand(
            id,
            request.Title,
            request.Description,
            request.Techstack,
            request.Link
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<ProjectResponse>(
                result.Value,
                "Project updated successfully."))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletProject(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteProjectCommand(id);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Project deleted successfully."))
            : HandleFailure(result);
    }

    [HttpPut("{id:guid}/media")]
    public async Task<IActionResult> UploadProjectMedia(
    [FromRoute] Guid id,
    IFormFile file,
    CancellationToken cancellationToken)
    {
        var command = new UploadProjectMediaCommand(id, file);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Project media uploaded successfully."))
            : HandleFailure(result);
    }
}
