using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations.Authentication
{
    public partial class UserFirstLogIn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFirstLogIn",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFirstLogIn",
                table: "AspNetUsers");
        }
    }
}
