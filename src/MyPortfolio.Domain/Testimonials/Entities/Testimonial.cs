using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Testimonials.Entities;

public sealed class Testimonial : BaseEntity
{
    private Testimonial() { }

    public Testimonial(
        Guid id, 
        string name, 
        string? role, 
        string? quote,
        string? photo) : base(id)
    {
        Name = name;
        Role = role;
        Quote = quote;
        Photo = photo;

        SubmittedAt = DateTime.UtcNow; 
    }

    public string Name { get; private set; } = null!;
    public string? Role { get; private set; }
    public string? Quote { get; private set; } = null!;
    public string? Photo { get; private set; }
    public DateTime SubmittedAt { get; private set; }
}
