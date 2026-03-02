using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.UpdateDetails;

public sealed record UpdateDetailsCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    int Age,
    string HeadLine,
    string About
) : ICommand<UserResponse>;
