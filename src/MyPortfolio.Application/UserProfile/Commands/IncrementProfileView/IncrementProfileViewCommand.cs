using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.IncrementProfileView;

public sealed record IncrementProfileViewCommand(Guid UserId) : ICommand<int>;