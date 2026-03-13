using MyPortfolio.Domain.Messages.Entities;

namespace MyPortfolio.Application.Messages.Responses;

public sealed class MessageResponse
{
    public Guid Id { get; set; }
    public string PersonName { get; set; } = null!;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string Content { get; set; } = null!;
    public DateTime SentAt { get; set; }

    public static MessageResponse FromEntity(Message message)
    {
        return new MessageResponse
        {
            Id = message.Id,
            PersonName = message.PersonName?.Value ?? string.Empty,
            Email = message.Email?.Value,
            PhoneNumber = message.PhoneNumber?.Value,
            Content = message.Content?.Value ?? string.Empty,
            SentAt = message.SentAt
        };
    }
}
