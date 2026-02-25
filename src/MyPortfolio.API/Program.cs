using Microsoft.EntityFrameworkCore;
using MyPortfolio.API.Extensions;
using MyPortfolio.Application;
using MyPortfolio.Infrastructure;
using MyPortfolio.Infrastructure.Seeding;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfig) =>
{
    loggerConfig.ReadFrom.Configuration(context.Configuration);
});

builder.Services.AddControllers();
builder.Services.AddOpenApi("v1");

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        dbContext.Database.Migrate();

        AdminSeeder.SeedAsync(dbContext).GetAwaiter().GetResult();

        Console.WriteLine("Database migrated and seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"DB migration/seeding failed: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "MyPortfolio API Reference";
        options.DarkMode = true;
        options.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
        options.CustomCss = "";
        options.AddPreferredSecuritySchemes("Bearer")
        .AddHttpAuthentication("Bearer", auth =>
        {
            auth.Token = "jwt-token-placeholder";
        }).EnablePersistentAuthentication();
    });

    app.ApplyMigrations();
}

app.UseHttpsRedirection();

app.UseSerilogRequestLogging();

app.UseRequestContextLogging();

app.UseCustomExceptionHandler();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();