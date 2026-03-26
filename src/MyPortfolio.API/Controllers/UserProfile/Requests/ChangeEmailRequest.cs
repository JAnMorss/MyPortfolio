using MyPortfolio.Domain.Common.ValueObjects;

namespace MyPortfolio.API.Controllers.UserProfile.Requests;

public sealed record ChangeEmailRequest(EmailAddress NewEmail);