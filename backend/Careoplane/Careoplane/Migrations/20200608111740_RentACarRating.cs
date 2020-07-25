using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class RentACarRating : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentACarRating",
                columns: table => new
                {
                    RentACarRatingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RentACarRatingValue = table.Column<int>(nullable: false),
                    RentACarName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentACarRating", x => x.RentACarRatingId);
                    table.ForeignKey(
                        name: "FK_RentACarRating_RentACars_RentACarName",
                        column: x => x.RentACarName,
                        principalTable: "RentACars",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentACarRating_RentACarName",
                table: "RentACarRating",
                column: "RentACarName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentACarRating");
        }
    }
}
