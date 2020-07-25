using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class VehicleReservation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleReservation_Vehicles_VehicleId",
                table: "VehicleReservation");

            migrationBuilder.DropIndex(
                name: "IX_VehicleReservation_VehicleId",
                table: "VehicleReservation");

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "VehicleReservation",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserName",
                table: "VehicleReservation");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleReservation_VehicleId",
                table: "VehicleReservation",
                column: "VehicleId");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleReservation_Vehicles_VehicleId",
                table: "VehicleReservation",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "VehicleId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
