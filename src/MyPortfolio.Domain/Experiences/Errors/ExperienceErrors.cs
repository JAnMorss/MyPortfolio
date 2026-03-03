using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Experiences.Errors;

public static class ExperienceErrors
{
    public static readonly Error NotFound = new(
        "Experience.NotFound",
        "The Experience with the specified identifier was not found.");

    public static readonly Error StartDateRequired = new(
        "Experience.StartDateRequired",
        "The Start Date is required and cannot be null.");

    public static readonly Error EndDateBeforeStartDate = new(
        "Experience.EndDateBeforeStartDate",
        "The End Date cannot be earlier than the Start Date.");
}

