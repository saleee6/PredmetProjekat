using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace RentACarMicroservice.Migrations
{
    public partial class Migration1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Discount",
                columns: table => new
                {
                    DiscountId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(nullable: true),
                    DiscountValue = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discount", x => x.DiscountId);
                });

            migrationBuilder.CreateTable(
                name: "RentACars",
                columns: table => new
                {
                    Name = table.Column<string>(nullable: false),
                    Address = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: false),
                    Rating = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentACars", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "VehicleReservation",
                columns: table => new
                {
                    ReservationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleId = table.Column<int>(nullable: false),
                    FromDate = table.Column<DateTime>(nullable: false),
                    FromLocation = table.Column<string>(nullable: false),
                    ToDate = table.Column<DateTime>(nullable: false),
                    ToLocation = table.Column<string>(nullable: false),
                    NumOfDays = table.Column<int>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    Type = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(nullable: false),
                    CreationDate = table.Column<DateTime>(nullable: false),
                    IsVehicleRated = table.Column<bool>(nullable: false),
                    IsRentACarRated = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleReservation", x => x.ReservationId);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    LocationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LocationValue = table.Column<string>(nullable: true),
                    RentACarName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.LocationId);
                    table.ForeignKey(
                        name: "FK_Location_RentACars_RentACarName",
                        column: x => x.RentACarName,
                        principalTable: "RentACars",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PriceList",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PriceValue = table.Column<double>(nullable: false),
                    PriceService = table.Column<string>(nullable: true),
                    RentACarName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PriceList", x => x.PriceId);
                    table.ForeignKey(
                        name: "FK_PriceList_RentACars_RentACarName",
                        column: x => x.RentACarName,
                        principalTable: "RentACars",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    VehicleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Brand = table.Column<string>(nullable: false),
                    Type = table.Column<string>(nullable: false),
                    NumOfSeats = table.Column<int>(nullable: false),
                    Year = table.Column<int>(nullable: false),
                    PricePerDay = table.Column<double>(nullable: false),
                    Location = table.Column<string>(nullable: false),
                    Rating = table.Column<double>(nullable: false),
                    IsOnSale = table.Column<bool>(nullable: false),
                    RentACarName = table.Column<string>(nullable: false),
                    Version = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.VehicleId);
                    table.ForeignKey(
                        name: "FK_Vehicles_RentACars_RentACarName",
                        column: x => x.RentACarName,
                        principalTable: "RentACars",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UnavailableDate",
                columns: table => new
                {
                    DateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(nullable: false),
                    VehicleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnavailableDate", x => x.DateId);
                    table.ForeignKey(
                        name: "FK_UnavailableDate_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "VehicleId",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "IX_Location_RentACarName",
                table: "Location",
                column: "RentACarName");

            migrationBuilder.CreateIndex(
                name: "IX_PriceList_RentACarName",
                table: "PriceList",
                column: "RentACarName");

            migrationBuilder.CreateIndex(
                name: "IX_RentACarRating_RentACarName",
                table: "RentACarRating",
                column: "RentACarName");

            migrationBuilder.CreateIndex(
                name: "IX_UnavailableDate_VehicleId",
                table: "UnavailableDate",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleRating_VehicleId",
                table: "VehicleRating",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_RentACarName",
                table: "Vehicles",
                column: "RentACarName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Discount");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "PriceList");

            migrationBuilder.DropTable(
                name: "RentACarRating");

            migrationBuilder.DropTable(
                name: "UnavailableDate");

            migrationBuilder.DropTable(
                name: "VehicleRating");

            migrationBuilder.DropTable(
                name: "VehicleReservation");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "RentACars");
        }
    }
}
