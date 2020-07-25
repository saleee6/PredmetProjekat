using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv30 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "FinalPrice",
                table: "FlightReservations",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalPrice",
                table: "FlightReservations");
        }
    }
}
