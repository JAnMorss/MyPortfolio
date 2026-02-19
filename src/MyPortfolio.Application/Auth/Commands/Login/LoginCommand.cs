using MyPortfolio.Application.Auth.Response;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password) : ICommand<AuthResponse>;
