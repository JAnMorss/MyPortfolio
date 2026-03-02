using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.UserProfile.Commands.UpdateDetails;

public sealed class UpdateDetailsCommandHandler 
    : ICommandHandler<UpdateDetailsCommand, UserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDetailsCommandHandler(
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<UserResponse>> Handle(
        UpdateDetailsCommand request, 
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if(user is null)
            return Result.Failure<UserResponse>(UserErrors.NotFound);

        var updateResult = user.UpdateDetails(
            request.FirstName, 
            request.LastName, 
            request.Age, 
            request.HeadLine, 
            request.About
        );

        if(updateResult.IsFailure)
            return Result.Failure<UserResponse>(updateResult.Error);

        await _userRepository.UpdateAsync(user, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(UserResponse.FromEntity(user));
    }
}
