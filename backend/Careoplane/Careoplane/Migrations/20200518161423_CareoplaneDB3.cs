using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDB3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connection_Flights_FlgihtFlightId",
                table: "Connection");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Segment",
                table: "Segment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SeatArrangement",
                table: "SeatArrangement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Destination",
                table: "Destination");

            migrationBuilder.DropIndex(
                name: "IX_Connection_FlgihtFlightId",
                table: "Connection");

            migrationBuilder.DropColumn(
                name: "PriceId",
                table: "Segment");

            migrationBuilder.DropColumn(
                name: "PriceId",
                table: "SeatArrangement");

            migrationBuilder.DropColumn(
                name: "DurationHours",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "PriceId",
                table: "Destination");

            migrationBuilder.DropColumn(
                name: "FlgihtFlightId",
                table: "Connection");

            migrationBuilder.AddColumn<int>(
                name: "SegmentId",
                table: "Segment",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Seats",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SeatArrangementId",
                table: "SeatArrangement",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<decimal>(
                name: "Value",
                table: "Price",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<int>(
                name: "DestinationId",
                table: "Destination",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "FlightId",
                table: "Connection",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "Rating",
                table: "Airlines",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Segment",
                table: "Segment",
                column: "SegmentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SeatArrangement",
                table: "SeatArrangement",
                column: "SeatArrangementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Destination",
                table: "Destination",
                column: "DestinationId");

            migrationBuilder.CreateIndex(
                name: "IX_Connection_FlightId",
                table: "Connection",
                column: "FlightId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connection_Flights_FlightId",
                table: "Connection",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "FlightId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connection_Flights_FlightId",
                table: "Connection");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Segment",
                table: "Segment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SeatArrangement",
                table: "SeatArrangement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Destination",
                table: "Destination");

            migrationBuilder.DropIndex(
                name: "IX_Connection_FlightId",
                table: "Connection");

            migrationBuilder.DropColumn(
                name: "SegmentId",
                table: "Segment");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "SeatArrangementId",
                table: "SeatArrangement");

            migrationBuilder.DropColumn(
                name: "DestinationId",
                table: "Destination");

            migrationBuilder.DropColumn(
                name: "FlightId",
                table: "Connection");

            migrationBuilder.AddColumn<int>(
                name: "PriceId",
                table: "Segment",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "PriceId",
                table: "SeatArrangement",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<double>(
                name: "Value",
                table: "Price",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AddColumn<int>(
                name: "DurationHours",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PriceId",
                table: "Destination",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "FlgihtFlightId",
                table: "Connection",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<double>(
                name: "Rating",
                table: "Airlines",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Segment",
                table: "Segment",
                column: "PriceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SeatArrangement",
                table: "SeatArrangement",
                column: "PriceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Destination",
                table: "Destination",
                column: "PriceId");

            migrationBuilder.CreateIndex(
                name: "IX_Connection_FlgihtFlightId",
                table: "Connection",
                column: "FlgihtFlightId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connection_Flights_FlgihtFlightId",
                table: "Connection",
                column: "FlgihtFlightId",
                principalTable: "Flights",
                principalColumn: "FlightId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
