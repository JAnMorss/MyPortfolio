using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPortfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddingClassCreatedAndUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Testimonials",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Skills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Skills",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Projects",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Experiences",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Experiences",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Educations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Educations",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Testimonials");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Educations");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Educations");
        }
    }
}
