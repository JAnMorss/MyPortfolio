using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("permissions");

        builder.HasKey(permission => permission.Id);

        builder.Property(p => p.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.HasData(Permission.UserRead);
    }
}
