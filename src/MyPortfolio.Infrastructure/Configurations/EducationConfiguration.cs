using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Educations.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class EducationConfiguration : IEntityTypeConfiguration<Education>
{
    public void Configure(EntityTypeBuilder<Education> builder)
    {
        builder.ToTable("Educations");

        builder.HasKey(e => e.Id);

        builder.OwnsOne(e => e.School, s =>
        {
            s.Property(e => e.Value)
                .HasColumnName("School")
                .HasMaxLength(200)
                .IsRequired();
        });

        builder.OwnsOne(e => e.Degree, d =>
        {
            d.Property(e => e.Value)
                .HasColumnName("Degree")
                .HasMaxLength(200)
                .IsRequired();
        });

        builder.OwnsOne(e => e.Description, d =>
        {
            d.Property(e => e.Value)
                .HasColumnName("Description")
                .HasMaxLength(1000);
        });

        builder.Property(e => e.StartDate);

        builder.Property(e => e.EndDate);
    }
}
