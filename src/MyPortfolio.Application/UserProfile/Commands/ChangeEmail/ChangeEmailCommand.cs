using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.ChangeEmail;

public sealed record ChangeEmailCommand(
    Guid UserId,
    EmailAddress NewEmail
) : ICommand;
