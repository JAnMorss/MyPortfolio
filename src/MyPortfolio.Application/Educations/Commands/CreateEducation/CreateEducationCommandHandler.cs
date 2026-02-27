using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.Domain.Educations.ValueObjects;
using MyPortfolio.Domain.Users.Errors;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.CreateEducation;

public sealed class CreateEducationCommandHandler 
    : ICommandHandler<CreateEducationCommand, EducationResponse>
{
    private readonly IEducationRepository _educationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEducationCommandHandler(
        IEducationRepository educationRepository,
        IUnitOfWork unitOfWork,
        IUserRepository userRepository)
    {
        _educationRepository = educationRepository;
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
    }

    public async Task<Result<EducationResponse>> Handle(
        CreateEducationCommand request, 
        CancellationToken cancellationToken)
    {
        var schoolResult = School.Create(request.School);
        if(schoolResult.IsFailure)
            return Result.Failure<EducationResponse>(schoolResult.Error);

        var degreeResult = Degree.Create(request.Degree);
        if(degreeResult.IsFailure)
            return Result.Failure<EducationResponse>(degreeResult.Error);

        var descriptionResult = Description.Create(request.Description);
        if(descriptionResult.IsFailure)
            return Result.Failure<EducationResponse>(descriptionResult.Error);

        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
            return Result.Failure<EducationResponse>(UserErrors.NotFound);

        var education = new Education(
            Guid.NewGuid(),
            schoolResult.Value,
            degreeResult.Value,
            request.StartDate,
            request.EndDate,
            descriptionResult.Value,
            user.Id);


        await _educationRepository.AddAsync(education, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(EducationResponse.FromEntity(education));
    }
}
