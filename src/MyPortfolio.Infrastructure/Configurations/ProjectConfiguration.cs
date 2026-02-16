using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Projects.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(e => e.Id);

        builder.OwnsOne(p => p.Title, t =>
        {
            t.Property(p => p.Value)
                .HasColumnName("Title")
                .HasMaxLength(200)
                .IsRequired();
        });

        builder.OwnsOne(p => p.Description, d =>
        {
            d.Property(p => p.Value)
                .HasColumnName("Description")
                .HasMaxLength(1000);
        });

        builder.OwnsOne(p => p.Techstack, t =>
        {
            t.Property(p => p.Value)
                .HasColumnName("Techstack")
                .HasMaxLength(500)
                .IsRequired();
        });

        builder.OwnsOne(p => p.Link, l =>
        {
            l.Property(p => p.Value)
                .HasColumnName("Link")
                .HasMaxLength(2048);
        });

        builder.OwnsOne(p => p.ImageUrl, i =>
        {
            i.Property(p => p.Value)
                .HasColumnName("ImageUrl")
                .HasMaxLength(500);
        });
    }
}
