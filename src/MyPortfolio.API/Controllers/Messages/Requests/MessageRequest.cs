namespace MyPortfolio.API.Controllers.Messages.Requests;

public sealed record MessageRequest(
    string PersonName,
    string? Email,
    string? PhoneNumber,
    string Content
);
