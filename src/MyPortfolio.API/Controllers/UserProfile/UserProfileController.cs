using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.Application.UserProfile.Queries.GetProfile;
using MyPortfolio.Application.UserProfile.Responses;

namespace MyPortfolio.API.Controllers.UserProfile;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/user-profile")]
[Authorize]
public class UserProfileController : ApiController
{
    public UserProfileController(ISender sender) : base(sender)
    {
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetUserProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }
        var query = new GetProfileQuery(userId.Value);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                result.Value, 
                "User profile retrieved successfully"))
            : HandleFailure(result);
    }
}
