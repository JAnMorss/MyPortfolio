using MediatR;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Domain.Educations.Entities;
using MyPortfolio.Domain.Experiences.Entities;
using MyPortfolio.Domain.Messages.Entities;
using MyPortfolio.Domain.Projects.Entities;
using MyPortfolio.Domain.Skills.Entities;
using MyPortfolio.Domain.Testimonials.Entities;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.SharedKernel;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Infrastructure;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly IPublisher _publisher;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IPublisher publisher)
        : base(options)
    {
        _publisher = publisher;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<Education> Educations { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Testimonial> Testimonials { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(u => u.RefreshTokens)
            .WithOne(u => u.User)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);

        await PublishDomainEventsAsync();

        return result;
    }

    public async Task PublishDomainEventsAsync()
    {
        var domainEvents = ChangeTracker
            .Entries<BaseEntity>()
            .Select(e => e.Entity)
            .SelectMany(entity =>
            {
                var events = entity.GetDomainEvents();
                entity.ClearDomainEvents();

                return events;
            }).ToList();

        foreach(var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }
    }
}
