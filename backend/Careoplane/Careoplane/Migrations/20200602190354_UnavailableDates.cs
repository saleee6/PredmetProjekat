using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class UnavailableDates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UnavailableDate_Vehicles_VehicleId",
                table: "UnavailableDate");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UnavailableDate",
                table: "UnavailableDate");

            migrationBuilder.RenameTable(
                name: "UnavailableDate",
                newName: "UnavailableDates");

            migrationBuilder.RenameIndex(
                name: "IX_UnavailableDate_VehicleId",
                table: "UnavailableDates",
                newName: "IX_UnavailableDates_VehicleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UnavailableDates",
                table: "UnavailableDates",
                column: "DateId");

            migrationBuilder.AddForeignKey(
                name: "FK_UnavailableDates_Vehicles_VehicleId",
                table: "UnavailableDates",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "VehicleId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UnavailableDates_Vehicles_VehicleId",
                table: "UnavailableDates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UnavailableDates",
                table: "UnavailableDates");

            migrationBuilder.RenameTable(
                name: "UnavailableDates",
                newName: "UnavailableDate");

            migrationBuilder.RenameIndex(
                name: "IX_UnavailableDates_VehicleId",
                table: "UnavailableDate",
                newName: "IX_UnavailableDate_VehicleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UnavailableDate",
                table: "UnavailableDate",
                column: "DateId");

            migrationBuilder.AddForeignKey(
                name: "FK_UnavailableDate_Vehicles_VehicleId",
                table: "UnavailableDate",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "VehicleId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
