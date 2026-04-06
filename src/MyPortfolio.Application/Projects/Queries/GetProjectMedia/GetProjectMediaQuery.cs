using MyPortfolio.Application.Projects.Responses;
using MyPortfolio.SharedKernel.Mediators.Query;

namespace MyPortfolio.Application.Projects.Queries.GetProjectMedia;

public sealed record GetProjectMediaQuery(Guid ProjectId) : IQuery<ProjectMediaResponse>;