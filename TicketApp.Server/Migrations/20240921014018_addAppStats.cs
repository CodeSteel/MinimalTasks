using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class addAppStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppStats",
                columns: table => new
                {
                    AppStatType = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppStats", x => x.AppStatType);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppStats");
        }
    }
}
