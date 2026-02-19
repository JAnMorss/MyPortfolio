using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Application.Abstractions;

public interface IJwtProvider
{
    string Generate(User user);

    string GenerateRefreshToken();
}
