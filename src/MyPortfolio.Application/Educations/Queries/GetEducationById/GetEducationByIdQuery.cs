using MyPortfolio.Application.Educations.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Educations.Queries.GetEducationById;

public sealed record GetEducationByIdQuery(Guid Id) : IQuery<EducationResponse>;
