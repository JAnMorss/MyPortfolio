using MyPortfolio.SharedKernel.ErrorHandling;

namespace MyPortfolio.Domain.Educations.Errors;

public static class EducationErrors
{
    public static readonly Error NotFound = new(
        "Education.NotFound",
        "The Education with the specified identifier was not found.");

    public static readonly Error StartDateRequired = new(
        "Education.StartDateRequired",
        "The Start Date is required and cannot be null.");

    public static readonly Error EndDateBeforeStartDate = new(
        "Education.EndDateBeforeStartDate",
        "The End Date cannot be earlier than the Start Date.");
}
