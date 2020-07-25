using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations.Authentication
{
    public partial class CareoplaneDBv27 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfPoint",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfPoint",
                table: "AspNetUsers");
        }
    }
}
