using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv16 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "appUserName",
                table: "FlightReservations",
                newName: "AppUserName");

            migrationBuilder.AddColumn<double>(
                name: "NewPrice",
                table: "FastTickets",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewPrice",
                table: "FastTickets");

            migrationBuilder.RenameColumn(
                name: "AppUserName",
                table: "FlightReservations",
                newName: "appUserName");
        }
    }
}
