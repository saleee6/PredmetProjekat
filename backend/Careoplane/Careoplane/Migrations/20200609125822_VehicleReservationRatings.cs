using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class VehicleReservationRatings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRentACarRated",
                table: "VehicleReservation",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVehicleRated",
                table: "VehicleReservation",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "VehicleRating",
                columns: table => new
                {
                    VehicleRatingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleRatingValue = table.Column<int>(nullable: false),
                    VehicleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleRating", x => x.VehicleRatingId);
                    table.ForeignKey(
                        name: "FK_VehicleRating_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "VehicleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VehicleRating_VehicleId",
                table: "VehicleRating",
                column: "VehicleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VehicleRating");

            migrationBuilder.DropColumn(
                name: "IsRentACarRated",
                table: "VehicleReservation");

            migrationBuilder.DropColumn(
                name: "IsVehicleRated",
                table: "VehicleReservation");
        }
    }
}
