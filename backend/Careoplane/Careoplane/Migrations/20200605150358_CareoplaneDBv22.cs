using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv22 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                table: "FlightReservationDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                table: "PassengerSeat");

            migrationBuilder.AlterColumn<int>(
                name: "FlightReservationDetailId",
                table: "PassengerSeat",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FlightReservationReservationId",
                table: "FlightReservationDetail",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                table: "FlightReservationDetail",
                column: "FlightReservationReservationId",
                principalTable: "FlightReservations",
                principalColumn: "ReservationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                table: "PassengerSeat",
                column: "FlightReservationDetailId",
                principalTable: "FlightReservationDetail",
                principalColumn: "FlightReservationDetailId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                table: "FlightReservationDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                table: "PassengerSeat");

            migrationBuilder.AlterColumn<int>(
                name: "FlightReservationDetailId",
                table: "PassengerSeat",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "FlightReservationReservationId",
                table: "FlightReservationDetail",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                table: "FlightReservationDetail",
                column: "FlightReservationReservationId",
                principalTable: "FlightReservations",
                principalColumn: "ReservationId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                table: "PassengerSeat",
                column: "FlightReservationDetailId",
                principalTable: "FlightReservationDetail",
                principalColumn: "FlightReservationDetailId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
