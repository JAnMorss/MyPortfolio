using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.API.Abstractions;
using MyPortfolio.API.Controllers.Messages.Requests;
using MyPortfolio.Application.Abstractions.PageSize;
using MyPortfolio.Application.Messages.Commands.DeleteMessage;
using MyPortfolio.Application.Messages.Commands.SendMessage;
using MyPortfolio.Application.Messages.Queries.GetAllMessages;
using MyPortfolio.Application.Messages.Queries.GetMessageById;
using MyPortfolio.Application.Messages.Responses;
using MyPortfolio.SharedKernel.Helpers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MyPortfolio.API.Controllers.Messages;

[ApiController]
[ApiVersion(ApiVersions.V1)]
[Route("api/v{version:apiVersion}/message")]
[Authorize(Roles = "Admin")]
public class MessageController : ApiController
{
    public MessageController(ISender sender) 
        : base(sender)
    {
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllMessages(
        [FromQuery] QueryObject queryObject,
        CancellationToken cancellationToken)
    {
        var query = new GetAllMessagesQuery(queryObject);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<PaginatedResult<MessageResponse>>(
                result.Value,
                "Messages retrieved successfully."))
            : HandleFailure(result);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMessageById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var query = new GetMessageByIdQuery(id);

        var result = await _sender.Send(query, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<MessageResponse>(
                result.Value,
                "Fetching message by Id is successfull."))
            :HandleFailure(result);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> SendMessage(
        [FromBody] MessageRequest request,
        CancellationToken cancellationToken)
    {
        var command = new SendMessageCommand(
            request.PersonName,
            request.Email,
            request.PhoneNumber,
            request.Content
        );

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse<MessageResponse>(
                result.Value,
                "Message sent successfully."))
            : HandleFailure(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMessage(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteMessageCommand(id);

        var result = await _sender.Send(command, cancellationToken);

        return result.IsSuccess
            ? Ok(new ApiResponse("Message deleted successfully."))
            : HandleFailure(result);
    }
}
