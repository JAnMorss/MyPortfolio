using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Skills.Errors;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.DeleteSkill;

public sealed class DeleteSkillCommandHandler
    : ICommandHandler<DeleteSkillCommand>
{
    private readonly ISkillRepository _skillRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSkillCommandHandler(
        ISkillRepository skillRepository,
        IUnitOfWork unitOfWork)
    {
        _skillRepository = skillRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        DeleteSkillCommand request, 
        CancellationToken cancellationToken)
    {
        var skill = await _skillRepository.GetByIdAsync(request.Id, cancellationToken);
        if(skill is null)
            return Result.Failure(SkillErrors.NotFound);

        await _skillRepository.DeleteAsync(skill.Id, cancellationToken); 

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
