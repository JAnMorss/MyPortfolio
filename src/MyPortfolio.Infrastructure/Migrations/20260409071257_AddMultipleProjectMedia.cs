using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPortfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMultipleProjectMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "Projects");

            migrationBuilder.CreateTable(
                name: "ProjectMedia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMedia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectMedia_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMedia_ProjectId",
                table: "ProjectMedia",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectMedia");

            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "Projects",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
    }
}
