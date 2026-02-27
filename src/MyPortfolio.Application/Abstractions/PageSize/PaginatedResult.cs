namespace MyPortfolio.Application.Abstractions.PageSize;

public sealed class PaginatedResult<T>
{
    public PaginatedResult(
        IReadOnlyList<T> items,
        int totalCount, 
        int page,
        int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }

    public IReadOnlyList<T> Items { get; init; } = null!;
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }

}
