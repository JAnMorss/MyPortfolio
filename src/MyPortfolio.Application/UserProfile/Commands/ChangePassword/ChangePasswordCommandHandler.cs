using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.Domain.Users.ValueObjects;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.ChangePassword;

public sealed class ChangePasswordCommandHandler
    : ICommandHandler<ChangePasswordCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        ChangePasswordCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if(user is null)
            return Result.Failure(UserErrors.NotFound);

        if(!user.PasswordHash.Verify(request.OldPassword))
            return Result.Failure(UserErrors.InvalidPassword);

        var newPasswordHash = PasswordHash.FromPlainText(request.NewPassword);

        var result = user.UpdatePassword(newPasswordHash);
        if (result.IsFailure)
            return result;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
