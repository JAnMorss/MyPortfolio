using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Auth.Response;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Auth.Commands.Login;

public sealed class LoginCommandHandler
    : ICommandHandler<LoginCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUnitOfWork _unitOfWork;

    public LoginCommandHandler(
        IUserRepository userRepository, 
        IJwtProvider jwtProvider, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtProvider = jwtProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AuthResponse>> Handle(
        LoginCommand request, 
        CancellationToken cancellationToken)
    {
        var emailResult = EmailAddress.Create(request.Email);
        if (emailResult.IsFailure)
            return Result.Failure<AuthResponse>(emailResult.Error);

        var user = await _userRepository.GetByEmailAsync(
            emailResult.Value, 
            cancellationToken
        );

        if(user is null)
            return Result.Failure<AuthResponse>(UserErrors.InvalidCredentials);

        if(!user.PasswordHash!.Verify(request.Password))
            return Result.Failure<AuthResponse>(UserErrors.InvalidCredentials);

        if (!user.Roles.Any(r => r.Name == "Admin"))
        {
            return Result.Failure<AuthResponse>(UserErrors.OnlyAdmin);
        }

        var token = _jwtProvider.Generate(user);
        var refreshToken = _jwtProvider.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken(
            user.Id,
            refreshToken,
            DateTime.UtcNow.AddDays(7)
        );

        await _unitOfWork.AddRefreshTokenAsync(refreshTokenEntity, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(new AuthResponse(
            token,
            refreshToken
        ));
    }
}
