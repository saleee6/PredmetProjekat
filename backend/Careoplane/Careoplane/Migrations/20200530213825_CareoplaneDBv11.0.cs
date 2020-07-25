using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv110 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SeatArrangementFlight",
                columns: table => new
                {
                    SeatArrangementFlightId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatArrangementFlight", x => x.SeatArrangementFlightId);
                    table.ForeignKey(
                        name: "FK_SeatArrangementFlight_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SegmentFlight",
                columns: table => new
                {
                    SegmentFlightId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SegmentFlight", x => x.SegmentFlightId);
                    table.ForeignKey(
                        name: "FK_SegmentFlight_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SeatArrangementFlight_FlightId",
                table: "SeatArrangementFlight",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_SegmentFlight_FlightId",
                table: "SegmentFlight",
                column: "FlightId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SeatArrangementFlight");

            migrationBuilder.DropTable(
                name: "SegmentFlight");
        }
    }
}
