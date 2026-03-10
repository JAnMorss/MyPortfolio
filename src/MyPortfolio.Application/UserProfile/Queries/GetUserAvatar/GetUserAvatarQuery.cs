using MyPortfolio.Application.UserProfile.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.UserProfile.Queries.GetUserAvatar;

public sealed record GetUserAvatarQuery(Guid UserId) : IQuery<UserAvatarResponse>;
