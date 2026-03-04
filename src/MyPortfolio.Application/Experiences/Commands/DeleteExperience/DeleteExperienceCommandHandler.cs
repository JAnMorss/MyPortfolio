using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Experiences.Errors;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Experiences.Commands.DeleteExperience;

public sealed class DeleteExperienceCommandHandler
    : ICommandHandler<DeleteExperienceCommand>
{
    private readonly IExperienceRepository _experienceRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteExperienceCommandHandler(
        IExperienceRepository experienceRepository, 
        IUnitOfWork unitOfWork)
    {
        _experienceRepository = experienceRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        DeleteExperienceCommand request,
        CancellationToken cancellationToken)
    {
        var experience = await _experienceRepository.GetByIdAsync(request.Id, cancellationToken);
        if(experience is null)
            return Result.Failure(ExperienceErrors.NotFound);

        await _experienceRepository.DeleteAsync(experience.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
