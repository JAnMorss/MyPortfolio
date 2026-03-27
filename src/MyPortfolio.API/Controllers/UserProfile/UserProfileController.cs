using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.UserProfile.Requests;
using MyPortfolio.Application.UserProfile.Commands.ChangeEmail;
using MyPortfolio.Application.UserProfile.Commands.ChangePassword;
using MyPortfolio.Application.UserProfile.Commands.UpdateDetails;
using MyPortfolio.Application.UserProfile.Commands.UploadUserAvatar;
using MyPortfolio.Application.UserProfile.Queries.GetProfile;
using MyPortfolio.Application.UserProfile.Queries.GetUserAvatar;
using MyPortfolio.Application.UserProfile.Responses;

namespace MyPortfolio.API.Controllers.UserProfile;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/user-profile")]
[Authorize(Roles = "Admin")]
public class UserProfileController : ApiController
{
    public UserProfileController(ISender sender) : base(sender)
    {
    }

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetUserProfile(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetProfileQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                result.Value,
                "User profile retrieved successfully"))
            : HandleFailure(result);
    }

    [HttpPatch("details")]
    public async Task<IActionResult> UpdateUserProfile(
        UserRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UpdateDetailsCommand(
            userId.Value,
            request.FirstName,
            request.LastName,
            request.Age,
            request.HeadLine,
            request.About
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserResponse>(
                result.Value, 
                "User profile updated successfully"))
            : HandleFailure(result);
    }

    [AllowAnonymous]
    [HttpGet("avatar/{id:guid}")]
    public async Task<IActionResult> GetUserAvatar(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetUserAvatarQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<UserAvatarResponse>(
                result.Value,
                "User Avatar fetched successfully"))
            : HandleFailure(result);
    }

    [HttpPut("avatar")]
    public async Task<IActionResult> UploadAvatar(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new UploadUserAvatarCommand(userId.Value, file);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("User avatar updated successfully"))
            : HandleFailure(result);
    }

    [HttpPatch("change-password")]
    public async Task<IActionResult> ChangePassword(
        ChangePasswordRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new ChangePasswordCommand(
            userId.Value,
            request.OldPassword,
            request.NewPassword
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Password changed successfully"))
            : HandleFailure(result);
    }

    [HttpPatch("change-email")]
    public async Task<IActionResult> ChangeEmail(
        ChangeEmailRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var command = new ChangeEmailCommand(
            userId.Value,
            request.NewEmail
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Email updated successfully"))
            : HandleFailure(result);
    }
}
