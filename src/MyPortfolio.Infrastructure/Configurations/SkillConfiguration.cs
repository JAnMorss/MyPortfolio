using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyPortfolio.Domain.Skills.Entities;

namespace MyPortfolio.Infrastructure.Configurations;

internal sealed class SkillConfiguration : IEntityTypeConfiguration<Skill>
{
    public void Configure(EntityTypeBuilder<Skill> builder)
    {
        builder.ToTable("Skills");

        builder.HasKey(s => s.Id);

        builder.OwnsOne(s => s.SkillName, sn =>
        {
            sn.Property(x => x.Value)
              .HasColumnName("SkillName")
              .IsRequired()
              .HasMaxLength(50);
        });

        builder.Property(s => s.Level)
               .HasConversion<int>();
    }
}

