namespace MyPortfolio.Application.Auth.Response;

public sealed class AuthResponse
{
    public AuthResponse(
        string token, 
        string refreshToken)
    {
        Token = token;
        RefreshToken = refreshToken;
    }

    public string Token { get; init; } = null!;

    public string RefreshToken { get; init; } = null!;
}
