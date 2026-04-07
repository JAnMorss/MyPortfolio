using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.IncrementProfileView;

public sealed class IncrementProfileViewCommandHandler : ICommandHandler<IncrementProfileViewCommand, int>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public IncrementProfileViewCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }


    public async Task<Result<int>> Handle(
        IncrementProfileViewCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

        if(user is null)
            return Result.Failure<int>(UserErrors.NotFound);

        user.IncrementProfileView();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(user.ProfileViews);
    }
}
