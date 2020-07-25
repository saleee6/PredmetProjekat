using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv20 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Airlines_AirlineName",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_AirlineName",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "AirlineName",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "NewPrice",
                table: "FastTickets");

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "Connection",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "Connection");

            migrationBuilder.AddColumn<string>(
                name: "AirlineName",
                table: "Seats",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "Seats",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "NewPrice",
                table: "FastTickets",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_AirlineName",
                table: "Seats",
                column: "AirlineName");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Airlines_AirlineName",
                table: "Seats",
                column: "AirlineName",
                principalTable: "Airlines",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
