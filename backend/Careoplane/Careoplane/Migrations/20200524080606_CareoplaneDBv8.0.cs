using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv80 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flights_Airlines_AirlineName",
                table: "Flights");

            migrationBuilder.AlterColumn<string>(
                name: "AirlineName",
                table: "Flights",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Flights_Airlines_AirlineName",
                table: "Flights",
                column: "AirlineName",
                principalTable: "Airlines",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flights_Airlines_AirlineName",
                table: "Flights");

            migrationBuilder.AlterColumn<string>(
                name: "AirlineName",
                table: "Flights",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddForeignKey(
                name: "FK_Flights_Airlines_AirlineName",
                table: "Flights",
                column: "AirlineName",
                principalTable: "Airlines",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
