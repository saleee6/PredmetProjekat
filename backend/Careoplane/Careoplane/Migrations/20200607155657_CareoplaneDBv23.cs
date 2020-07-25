using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv23 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Accepted",
                table: "PassengerSeat",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AirlineScored",
                table: "PassengerSeat",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "FlightScored",
                table: "PassengerSeat",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "AirlineName",
                table: "FlightReservationDetail",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Accepted",
                table: "PassengerSeat");

            migrationBuilder.DropColumn(
                name: "AirlineScored",
                table: "PassengerSeat");

            migrationBuilder.DropColumn(
                name: "FlightScored",
                table: "PassengerSeat");

            migrationBuilder.DropColumn(
                name: "AirlineName",
                table: "FlightReservationDetail");
        }
    }
}
