using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.Auth.Requests;
using MyPortfolio.Application.Auth.Commands.Login;
using MyPortfolio.Application.Auth.Response;

namespace MyPortfolio.API.Controllers.Auth;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController : ApiController
{
    public AuthController(ISender sender)
        : base(sender)
    {
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LoginCommand(
            request.Email,
            request.Password);

        var result = await _sender.Send(
            command,
            cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<AuthResponse>(
                    result.Value,
                    "Login successful"))
            : HandleFailure(result);
    }
}

