using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Users.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.OwnsOne(u => u.FirstName, fn =>
        {
            fn.Property(f => f.Value)
                .HasColumnName("FirstName")
                .HasMaxLength(50)
                .IsRequired();
        });

        builder.OwnsOne(u => u.LastName, ln =>
        {
            ln.Property(l => l.Value)
                .HasColumnName("LastName")
                .HasMaxLength(50)
                .IsRequired();
        });

        builder.OwnsOne(u => u.Age, a =>
        {
            a.Property(age => age.Value)
                .HasColumnName("Age")
                .IsRequired();
        });

        builder.OwnsOne(u => u.Email, e =>
        {
            e.Property(email => email.Value)
                .HasColumnName("Email")
                .HasMaxLength(255)
                .IsRequired();

            e.HasIndex(x => x.Value)
                .IsUnique();
        });

        builder.OwnsOne(u => u.HeadLine, hl =>
        {
            hl.Property(h => h.Value)
                .HasColumnName("HeadLine")
                .HasMaxLength(200);
        });

        builder.OwnsOne(u => u.About, a =>
        {
            a.Property(ab => ab.Value)
                .HasColumnName("About")
                .HasMaxLength(1000);
        });

        builder.OwnsOne(u => u.Photo, p =>
        {
            p.Property(ph => ph.Value)
                .HasColumnName("Photo")
                .HasMaxLength(500);
        });

        builder.OwnsOne(u => u.PasswordHash, ph =>
        {
            ph.Property(p => p.Value)
                .HasColumnName("PasswordHash")
                .HasMaxLength(500)
                .IsRequired();
        });

        builder.HasOne(u => u.Role)
           .WithMany(r => r.Users)
           .HasForeignKey(u => u.RoleId)
           .IsRequired()
           .OnDelete(DeleteBehavior.Restrict);


        builder.HasMany(u => u.Educations)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);

        builder.HasMany(u => u.Experiences)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);

        builder.HasMany(u => u.Projects)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);

        builder.HasMany(u => u.Skills)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
    }
}
