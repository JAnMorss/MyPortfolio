using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Errors;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.UpdateSkill;

public sealed class UpdateSkillCommandHandler
    : ICommandHandler<UpdateSkillCommand, SkillResponse>
{
    private readonly ISkillRepository _skillRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSkillCommandHandler(
        ISkillRepository skillRepository,
        IUnitOfWork unitOfWork)
    {
        _skillRepository = skillRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<SkillResponse>> Handle(
        UpdateSkillCommand request, 
        CancellationToken cancellationToken)
    {
        var skill = await _skillRepository.GetByIdAsync(request.Id, cancellationToken);
        if(skill is null)
            return Result.Failure<SkillResponse>(SkillErrors.NotFound);

        var updateResult = skill.Update(
            request.SkillName,
            request.Level
        );

        if (updateResult.IsFailure)
            return Result.Failure<SkillResponse>(updateResult.Error);

        await _skillRepository.UpdateAsync(skill, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(SkillResponse.FromEntity(skill));
    }
}
