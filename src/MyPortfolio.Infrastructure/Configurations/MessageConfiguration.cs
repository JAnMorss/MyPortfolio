using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Messages.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("Messages");

        builder.HasKey(m => m.Id);

        builder.OwnsOne(m => m.PersonName, pn =>
        {
            pn.Property(p => p.Value)
              .HasColumnName("PersonName")
              .HasMaxLength(150)
              .IsRequired();
        });

        builder.OwnsOne(m => m.Email, e =>
        {
            e.Property(p => p.Value)
              .HasColumnName("Email")
              .HasMaxLength(255)
              .IsRequired(false);
        });

        builder.OwnsOne(m => m.PhoneNumber, e =>
        {
            e.Property(p => p.Value)
              .HasColumnName("PhoneNumber")
              .HasMaxLength(16)
              .IsRequired(false);
        });

        builder.OwnsOne(m => m.Content, e =>
        {
            e.Property(p => p.Value)
              .HasColumnName("Content")
              .HasMaxLength(1000)
              .IsRequired();
        });

        builder.Property(m => m.SentAt)
               .IsRequired();
    }
}
