using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Skills.Responses;
using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.Domain.Skills.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Skills.Commands.CreateSkill;

public sealed class CreateSkillCommandHandler
    : ICommandHandler<CreateSkillCommand, SkillResponse>
{
    private readonly ISkillRepository _skillRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSkillCommandHandler(
        ISkillRepository skillRepository,
        IUserRepository userRepository, 
        IUnitOfWork unitOfWork)
    {
        _skillRepository = skillRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<SkillResponse>> Handle(
        CreateSkillCommand request,
        CancellationToken cancellationToken)
    {
        var skillNameResult = SkillName.Create(request.SkillName);
        if(skillNameResult.IsFailure)
            return Result.Failure<SkillResponse>(skillNameResult.Error);

        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if(user is null)
            return Result.Failure<SkillResponse>(UserErrors.NotFound);

        var skill = new Skill(
            Guid.NewGuid(),
            skillNameResult.Value,
            request.Level,
            user.Id
        );

        await _skillRepository.AddAsync(skill, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(SkillResponse.FromEntity(skill));
    }
}
