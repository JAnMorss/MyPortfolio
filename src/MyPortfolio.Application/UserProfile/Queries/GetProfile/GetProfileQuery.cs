using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.UserProfile.Queries.GetProfile;

public sealed record GetProfileQuery(Guid UserId) : IQuery<UserResponse>;