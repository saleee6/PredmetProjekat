using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv21 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserName",
                table: "FlightReservations");

            migrationBuilder.DropColumn(
                name: "FlightId",
                table: "FlightReservations");

            migrationBuilder.DropColumn(
                name: "SeatId",
                table: "FlightReservations");

            migrationBuilder.CreateTable(
                name: "FlightReservationDetail",
                columns: table => new
                {
                    FlightReservationDetailId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightReservationReservationId = table.Column<int>(nullable: true),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightReservationDetail", x => x.FlightReservationDetailId);
                    table.ForeignKey(
                        name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                        column: x => x.FlightReservationReservationId,
                        principalTable: "FlightReservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PassengerSeat",
                columns: table => new
                {
                    PassengerSeatId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightReservationDetailId = table.Column<int>(nullable: true),
                    SeatId = table.Column<int>(nullable: false),
                    Username = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),
                    Passport = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassengerSeat", x => x.PassengerSeatId);
                    table.ForeignKey(
                        name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                        column: x => x.FlightReservationDetailId,
                        principalTable: "FlightReservationDetail",
                        principalColumn: "FlightReservationDetailId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlightReservationDetail_FlightReservationReservationId",
                table: "FlightReservationDetail",
                column: "FlightReservationReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_PassengerSeat_FlightReservationDetailId",
                table: "PassengerSeat",
                column: "FlightReservationDetailId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PassengerSeat");

            migrationBuilder.DropTable(
                name: "FlightReservationDetail");

            migrationBuilder.AddColumn<string>(
                name: "AppUserName",
                table: "FlightReservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FlightId",
                table: "FlightReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatId",
                table: "FlightReservations",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
