using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.ChangePassword;

public sealed record ChangePasswordCommand(
    Guid UserId,
    string OldPassword,
    string NewPassword
) : ICommand;