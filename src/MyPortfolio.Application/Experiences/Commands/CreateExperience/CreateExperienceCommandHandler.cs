using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.Domain.Experiences.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.CreateExperience;

public sealed class CreateExperienceCommandHandler 
    : ICommandHandler<CreateExperienceCommand, ExperienceResponse>
{
    private readonly IExperienceRepository _experienceRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateExperienceCommandHandler(
        IExperienceRepository experienceRepository, 
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork
    )
    {
        _experienceRepository = experienceRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ExperienceResponse>> Handle(
        CreateExperienceCommand request, 
        CancellationToken cancellationToken)
    {
        var companyNameResult = CompanyName.Create(request.CompanyName);
        if (companyNameResult.IsFailure)
            return Result.Failure<ExperienceResponse>(companyNameResult.Error);

        var descriptionResult = Description.Create(request.Description);
        if(descriptionResult.IsFailure)
            return Result.Failure<ExperienceResponse>(descriptionResult.Error);

        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if(user is null)
            return Result.Failure<ExperienceResponse>(UserErrors.NotFound);

        var experience = new Experience(
            Guid.NewGuid(),
            companyNameResult.Value,
            request.StartDate,
            request.EndDate,
            descriptionResult.Value,
            user.Id);

        await _experienceRepository.AddAsync(experience, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(ExperienceResponse.FromEntity(experience));
    }
}
