using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv100 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FastTickets_Flights_FlightId",
                table: "FastTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_FastTickets_Seats_SeatId",
                table: "FastTickets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FastTickets",
                table: "FastTickets");

            migrationBuilder.DropIndex(
                name: "IX_FastTickets_FlightId",
                table: "FastTickets");

            migrationBuilder.DropIndex(
                name: "IX_FastTickets_SeatId",
                table: "FastTickets");

            migrationBuilder.DropColumn(
                name: "FastTicketId",
                table: "FastTickets");

            migrationBuilder.AlterColumn<int>(
                name: "SeatId",
                table: "FastTickets",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FlightId",
                table: "FastTickets",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FastTickets",
                table: "FastTickets",
                column: "SeatId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FastTickets",
                table: "FastTickets");

            migrationBuilder.AlterColumn<int>(
                name: "FlightId",
                table: "FastTickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "SeatId",
                table: "FastTickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "FastTicketId",
                table: "FastTickets",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FastTickets",
                table: "FastTickets",
                column: "FastTicketId");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_FlightId",
                table: "FastTickets",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_SeatId",
                table: "FastTickets",
                column: "SeatId");

            migrationBuilder.AddForeignKey(
                name: "FK_FastTickets_Flights_FlightId",
                table: "FastTickets",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "FlightId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FastTickets_Seats_SeatId",
                table: "FastTickets",
                column: "SeatId",
                principalTable: "Seats",
                principalColumn: "SeatId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
