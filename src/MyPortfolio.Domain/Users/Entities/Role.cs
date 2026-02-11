namespace MyPortfolio.Domain.Users.Entities;

public sealed class Role
{
    public static readonly Role Admin = new(1, "Admin");

    public Role(int id, string name)
    {
        Id = id;
        Name = name;
    }

    public int Id { get; init; }

    public string Name { get; init; }

    public ICollection<User> Users { get; init; } = new List<User>();

}
