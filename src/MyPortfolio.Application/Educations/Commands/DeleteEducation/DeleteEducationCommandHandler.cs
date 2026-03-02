using MyPortfolio.Application.Abstractions;
using MyPortfolio.Domain.Educations.Errors;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.SharedKernel.ErrorHandling;
using MyPortfolio.SharedKernel.Mediators.Command;

namespace MyPortfolio.Application.Educations.Commands.DeleteEducation;

public sealed class DeleteEducationCommandHandler : ICommandHandler<DeleteEducationCommand, Guid>
{
    private readonly IEducationRepository _educationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteEducationCommandHandler(
        IEducationRepository educationRepository,
        IUnitOfWork unitOfWork)
    {
        _educationRepository = educationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        DeleteEducationCommand request, 
        CancellationToken cancellationToken)
    {
        var education = await _educationRepository.GetByIdAsync(request.Id, cancellationToken);
        if (education is null)
            return Result.Failure<Guid>(EducationErrors.NotFound);

        await _educationRepository.DeleteAsync(education.Id, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(education.Id);
    }
}
