using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Messages.Entities;

public sealed class Message : BaseEntity
{
    private Message() { }

    public Message(Guid id) : base(id)
    {
    }

    public Message(
        string name,
        string? email,
        string? phoneNumber, 
        string content)
    {
        Name = name;
        Email = email;
        PhoneNumber = phoneNumber;
        Content = content;

        SentAt = DateTime.UtcNow;
    }

    public string Name { get; private set; } = null!;
    public string? Email { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string Content { get; private set; } = null!;
    public DateTime SentAt { get; private set; } 
}
