using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Messages.ValueObjects;
using MyPortfolio.SharedKernel.Domain;
using System.Reflection.Metadata;

namespace MyPortfolio.Domain.Messages.Entities;

public sealed class Message : BaseEntity
{
    private Message() { }

    public Message(Guid id) : base(id)
    {
    }

    public Message(
        PersonName personName,
        EmailAddress? email,
        PhoneNumber? phoneNumber,
        Content content)
    {
        PersonName = personName;
        Email = email;
        PhoneNumber = phoneNumber;
        Content = content;

        SentAt = DateTime.UtcNow;
    }

    public PersonName PersonName { get; private set; } = null!;
    public EmailAddress? Email { get; private set; }
    public PhoneNumber? PhoneNumber { get; private set; }
    public Content Content { get; private set; } = null!;
    public DateTime SentAt { get; private set; } 
}
