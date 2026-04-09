using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Experiences.Responses;
using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.Domain.Projects.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Projects.Commands.CreateProject;

public sealed class CreateProjectCommandHandler
    : ICommandHandler<CreateProjectCommand, ProjectResponse>
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProjectCommandHandler(
        IProjectRepository projectRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProjectResponse>> Handle(
        CreateProjectCommand request, 
        CancellationToken cancellationToken)
    {
        var titleResult = Title.Create(request.Title);
        if (titleResult.IsFailure)
            return Result.Failure<ProjectResponse>(titleResult.Error);

        var descriptionResult = Description.Create(request.Description);
        if (descriptionResult.IsFailure)
            return Result.Failure<ProjectResponse>(descriptionResult.Error);

        var techstackResult = Techstack.Create(request.Techstack);
        if (techstackResult.IsFailure)
            return Result.Failure<ProjectResponse>(techstackResult.Error);

        var linkResult = Link.Create(request.Link);
        if (linkResult.IsFailure)
            return Result.Failure<ProjectResponse>(linkResult.Error);

        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<ProjectResponse>(UserErrors.NotFound);

        var project = new Project(
            Guid.NewGuid(),
            titleResult.Value,
            descriptionResult.Value,
            techstackResult.Value,
            linkResult.Value,
            user.Id
        );

        await _projectRepository.AddAsync(project, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(ProjectResponse.FromEntity(project));
    }
}
