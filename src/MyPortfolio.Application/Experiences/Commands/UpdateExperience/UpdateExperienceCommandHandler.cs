using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.Domain.Experiences.Errors;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.UpdateExperience;

public sealed class UpdateExperienceCommandHandler
    : ICommandHandler<UpdateExperienceCommand, ExperienceResponse>
{
    private readonly IExperienceRepository _experienceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateExperienceCommandHandler(
        IExperienceRepository experienceRepository, 
        IUnitOfWork unitOfWork)
    {
        _experienceRepository = experienceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ExperienceResponse>> Handle(
        UpdateExperienceCommand request, 
        CancellationToken cancellationToken)
    {
        var experience = await _experienceRepository.GetByIdAsync(request.Id, cancellationToken);
        if(experience is null)
            return Result.Failure<ExperienceResponse>(ExperienceErrors.NotFound);

        var updateResult = experience.UpdateExperience(
            request.CompanyName, 
            request.StartDate, 
            request.EndDate, 
            request.Description);

        if(updateResult.IsFailure)
            return Result.Failure<ExperienceResponse>(updateResult.Error);

        await _experienceRepository.UpdateAsync(experience, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(ExperienceResponse.FromEntity(experience));
    }
}
