using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv29 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Creator",
                table: "FlightReservations",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VehicleReservationId",
                table: "FlightReservations",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Creator",
                table: "FlightReservations");

            migrationBuilder.DropColumn(
                name: "VehicleReservationId",
                table: "FlightReservations");
        }
    }
}
