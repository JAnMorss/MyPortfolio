using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Testimonials.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> builder)
    {
        builder.ToTable("Testimonials");

        builder.HasKey(t => t.Id);

        builder.OwnsOne(t => t.PersonName, pn =>
        {
            pn.Property(x => x.Value)
              .HasColumnName("PersonName")
              .IsRequired()
              .HasMaxLength(150);
        });

        builder.OwnsOne(t => t.Quote, q =>
        {
            q.Property(x => x.Value)
             .HasColumnName("Quote")
             .HasMaxLength(1000);
        });

        builder.OwnsOne(t => t.Photo, p =>
        {
            p.Property(x => x.Value)
             .HasColumnName("Photo")
             .HasMaxLength(500);
        });

        builder.Property(t => t.Status)
               .HasConversion<int>();
    }
}

