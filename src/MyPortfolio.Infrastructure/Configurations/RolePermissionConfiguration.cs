using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("role_permissions");

        builder.HasKey(rp => new { rp.RoleId, rp.PermissionId });

        builder.HasOne<Role>()  
               .WithMany() 
               .HasForeignKey(rp => rp.RoleId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Permission>() 
               .WithMany() 
               .HasForeignKey(rp => rp.PermissionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasData(new RolePermission
        {
            RoleId = Role.Admin.Id,
            PermissionId = Permission.UserRead.Id
        });
    }
}
