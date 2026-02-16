using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Testimonials.Enums;
using MyPortfolio.Domain.Testimonials.ValueObjects;
using MyPortfolio.SharedKernel.Domain;

namespace MyPortfolio.Domain.Testimonials.Entities;

public sealed class Testimonial : BaseEntity
{
    private Testimonial() { }

    public Testimonial(
        Guid id,
        PersonName personName,
        Quote? quote,
        Photo? photo) : base(id)
    {
        PersonName = personName;
        Quote = quote;
        Photo = photo;
        Status = TestimonialStatus.Pending;

        SubmittedAt = DateTime.UtcNow; 
    }

    public PersonName PersonName { get; private set; } = null!;
    public Quote? Quote { get; private set; } = null!;
    public Photo? Photo { get; private set; }
    public TestimonialStatus Status { get; private set; }
    public DateTime SubmittedAt { get; private set; }

    public void Approved()
        => Status = TestimonialStatus.Approved;
    public void Rejected()
        => Status = TestimonialStatus.Rejected;
}
