using Microsoft.EntityFrameworkCore;
using MyPortfolio.Domain.Common.ValueObjects;
using MyPortfolio.Domain.Users.Entities;
using MyPortfolio.Domain.Users.ValueObjects;

namespace MyPortfolio.Infrastructure.Seeding;

public static class AdminSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole == null)
        {
            adminRole = new Role(1, "Admin");
            context.Roles.Add(adminRole);
            await context.SaveChangesAsync();
        }

        var firstName = new FirstName("John Anthony");
        var lastName = new LastName("Morales");
        var age = new Age(26);
        var email = EmailAddress.Create("janmorsthirteen@gmail.com").Value;
        var headLine = HeadLine.Create("Administrator").Value;
        var about = About.Create("This is the default admin user.").Value;
        var passwordHash = PasswordHash.FromPlainText("P@ssw0rd!");

        var adminUserResult = User.Create(
            firstName,
            lastName,
            age,
            email,
            headLine,
            about,
            null,
            passwordHash
        );

        var adminUser = adminUserResult.Value;

        adminUser.AssignRole(adminRole);

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}