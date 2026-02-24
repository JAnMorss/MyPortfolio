using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.UserProfile.Queries.GetProfile;

public sealed class GetProfileQueryHandler : IQueryHandler<GetProfileQuery, UserResponse>
{
    private readonly IUserRepository _userRepository;

    public GetProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserResponse>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null) 
            return Result.Failure<UserResponse>(UserErrors.NotFound);

        return Result.Success(UserResponse.FromEntity(user));
    }
}
