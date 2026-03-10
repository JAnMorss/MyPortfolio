using Asp.Versioning;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyPortfolio.Application.Abstractions;
using MyPortfolio.Application.Abstractions.BlobStorage;
using MyPortfolio.Domain.Educations.Interface;
using MyPortfolio.Domain.Experiences.Interface;
using MyPortfolio.Domain.Projects.Interface;
using MyPortfolio.Domain.Skills.Interface;
using MyPortfolio.Domain.Users.Interface;
using MyPortfolio.Infrastructure.Authentication;
using MyPortfolio.Infrastructure.Authentication.Extensions;
using MyPortfolio.Infrastructure.BlobStorage;
using MyPortfolio.Infrastructure.Repositories;

namespace MyPortfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        AddPersistence(services, configuration);

        AddAuthentication(services, configuration);

        AddApiVersioning(services);

        return services;
    }

    public static void AddPersistence(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database");
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null
                );
            });
        });

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IEducationRepository, EducationRepository>();
        services.AddScoped<IExperienceRepository, ExperienceRepository>();
        services.AddScoped<ISkillRepository, SkillRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();

        services.AddSingleton(x => new BlobServiceClient(configuration.GetConnectionString("BlobStorage")));
        services.AddScoped<IBlobService, BlobService>();
    }

    private static void AddAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddJwtAuthentication(configuration);

        services.AddScoped<IJwtProvider, JwtProvider>();
    }

    private static void AddApiVersioning(IServiceCollection services)
    {
        services
            .AddApiVersioning(static options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });
    }
}