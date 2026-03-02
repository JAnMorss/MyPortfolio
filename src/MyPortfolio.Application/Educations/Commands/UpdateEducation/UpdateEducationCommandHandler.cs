using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.Domain.Educations.ValueObjects;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.UpdateEducation;

public sealed class UpdateEducationCommandHandler : ICommandHandler<UpdateEducationCommand, EducationResponse>
{
    private readonly IEducationRepository _educationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateEducationCommandHandler(
        IEducationRepository educationRepository,
        IUnitOfWork unitOfWork)
    {
        _educationRepository = educationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<EducationResponse>> Handle(
        UpdateEducationCommand request,
        CancellationToken cancellationToken)
    {
        var education = await _educationRepository.GetByIdAsync(request.Id, cancellationToken);
        if (education is null)
            return Result.Failure<EducationResponse>(EducationErrors.NotFound);

       var updateResult = education.UpdateEducation(
            request.School,
            request.Degree,
            request.StartDate,
            request.EndDate,
            request.Description);

        if (updateResult.IsFailure)
            return Result.Failure<EducationResponse>(updateResult.Error);

        await _educationRepository.UpdateAsync(education, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(EducationResponse.FromEntity(education));
    }
}
