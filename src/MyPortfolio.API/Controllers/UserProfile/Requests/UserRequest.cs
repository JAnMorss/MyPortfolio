namespace MyPortfolio.API.Controllers.UserProfile.Requests;

public sealed record UserRequest(
    string FirstName,
    string LastName,
    int Age,
    string HeadLine,
    string About
);