using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Experiences.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
{
    public void Configure(EntityTypeBuilder<Experience> builder)
    {
        builder.ToTable("Experiences");

        builder.HasKey(e => e.Id);

        builder.OwnsOne(e => e.CompanyName, c =>
        {
            c.Property(x => x.Value)
                .HasColumnName("CompanyName")
                .HasMaxLength(200)
                .IsRequired();
        });

        builder.OwnsOne(e => e.Description, d =>
        {
            d.Property(x => x.Value)
                .HasColumnName("Description")
                .HasMaxLength(1000);
        });
    }
}
