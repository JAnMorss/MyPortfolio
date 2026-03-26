using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.ChangeEmail;

public sealed class ChangeEmailCommandHandler
    : ICommandHandler<ChangeEmailCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ChangeEmailCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result> Handle(
        ChangeEmailCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure(UserErrors.NotFound);

        if (request.NewEmail.Value != user.Email.Value)
        {
            if (await _userRepository.ExistsByEmailAsync(request.NewEmail, cancellationToken))
                return Result.Failure(UserErrors.EmailAlreadyExists);
        }

        var result = user.UpdateEmail(request.NewEmail);
        if (result.IsFailure) return result;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
