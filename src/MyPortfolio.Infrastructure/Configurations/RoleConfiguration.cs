using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .ValueGeneratedNever();

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasMany(role => role.Users)
            .WithMany(role => role.Roles)
            .UsingEntity(r => r.ToTable("UserRoles"));

        builder.HasData(
            new Role(Role.Admin.Id, Role.Admin.Name)
        );
    }
}
