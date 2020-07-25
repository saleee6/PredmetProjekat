using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class CareoplaneDBv120 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FastTickets_Airlines_AirlineName",
                table: "FastTickets");

            migrationBuilder.AlterColumn<string>(
                name: "AirlineName",
                table: "FastTickets",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FastTickets_Airlines_AirlineName",
                table: "FastTickets",
                column: "AirlineName",
                principalTable: "Airlines",
                principalColumn: "Name",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FastTickets_Airlines_AirlineName",
                table: "FastTickets");

            migrationBuilder.AlterColumn<string>(
                name: "AirlineName",
                table: "FastTickets",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddForeignKey(
                name: "FK_FastTickets_Airlines_AirlineName",
                table: "FastTickets",
                column: "AirlineName",
                principalTable: "Airlines",
                principalColumn: "Name",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
