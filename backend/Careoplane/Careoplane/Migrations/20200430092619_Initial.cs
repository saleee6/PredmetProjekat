using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Careoplane.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Airlines",
                columns: table => new
                {
                    Name = table.Column<string>(nullable: false),
                    Address = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Image = table.Column<string>(nullable: true),
                    Rating = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Airlines", x => x.Name);
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
                name: "Destination",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: true),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destination", x => x.PriceId);
                    table.ForeignKey(
                        name: "FK_Destination_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Flights",
                columns: table => new
                {
                    FlightId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AirlineName = table.Column<string>(nullable: true),
                    Origin = table.Column<string>(nullable: true),
                    Destination = table.Column<string>(nullable: true),
                    Departure = table.Column<DateTime>(nullable: false),
                    Arrival = table.Column<DateTime>(nullable: false),
                    DurationHours = table.Column<int>(nullable: false),
                    DurationMinutes = table.Column<int>(nullable: false),
                    Distance = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flights", x => x.FlightId);
                    table.ForeignKey(
                        name: "FK_Flights_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Price",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price", x => x.PriceId);
                    table.ForeignKey(
                        name: "FK_Price_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SeatArrangement",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatArrangement", x => x.PriceId);
                    table.ForeignKey(
                        name: "FK_SeatArrangement_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Segment",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Segment", x => x.PriceId);
                    table.ForeignKey(
                        name: "FK_Segment_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
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
                name: "Vehicles",
                columns: table => new
                {
                    VehicleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(nullable: false),
                    Brand = table.Column<string>(nullable: false),
                    Type = table.Column<string>(nullable: false),
                    NumOfSeats = table.Column<int>(nullable: false),
                    Year = table.Column<int>(nullable: false),
                    PricePerDay = table.Column<double>(nullable: false),
                    Location = table.Column<string>(nullable: false),
                    Rating = table.Column<double>(nullable: false),
                    IsOnSale = table.Column<bool>(nullable: false),
                    RentACarName = table.Column<string>(nullable: false)
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
                name: "Connection",
                columns: table => new
                {
                    ConntectionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlgihtFlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connection", x => x.ConntectionId);
                    table.ForeignKey(
                        name: "FK_Connection_Flights_FlgihtFlightId",
                        column: x => x.FlgihtFlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seats",
                columns: table => new
                {
                    SeatId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AirlineName = table.Column<string>(nullable: true),
                    FlightId = table.Column<int>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Occupied = table.Column<bool>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    Discount = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seats", x => x.SeatId);
                    table.ForeignKey(
                        name: "FK_Seats_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Seats_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Restrict);
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
                    Type = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleReservation", x => x.ReservationId);
                    table.ForeignKey(
                        name: "FK_VehicleReservation_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "VehicleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FastTickets",
                columns: table => new
                {
                    FastTicketId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NewPrice = table.Column<double>(nullable: false),
                    SeatId = table.Column<int>(nullable: true),
                    FlightId = table.Column<int>(nullable: true),
                    AirlineName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FastTickets", x => x.FastTicketId);
                    table.ForeignKey(
                        name: "FK_FastTickets_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FastTickets_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FastTickets_Seats_SeatId",
                        column: x => x.SeatId,
                        principalTable: "Seats",
                        principalColumn: "SeatId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connection_FlgihtFlightId",
                table: "Connection",
                column: "FlgihtFlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Destination_AirlineName",
                table: "Destination",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_AirlineName",
                table: "FastTickets",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_FlightId",
                table: "FastTickets",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_SeatId",
                table: "FastTickets",
                column: "SeatId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_AirlineName",
                table: "Flights",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_Location_RentACarName",
                table: "Location",
                column: "RentACarName");

            migrationBuilder.CreateIndex(
                name: "IX_Price_AirlineName",
                table: "Price",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_PriceList_RentACarName",
                table: "PriceList",
                column: "RentACarName");

            migrationBuilder.CreateIndex(
                name: "IX_SeatArrangement_AirlineName",
                table: "SeatArrangement",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_AirlineName",
                table: "Seats",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_FlightId",
                table: "Seats",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Segment_AirlineName",
                table: "Segment",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_UnavailableDate_VehicleId",
                table: "UnavailableDate",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_VehicleReservation_VehicleId",
                table: "VehicleReservation",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_RentACarName",
                table: "Vehicles",
                column: "RentACarName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connection");

            migrationBuilder.DropTable(
                name: "Destination");

            migrationBuilder.DropTable(
                name: "FastTickets");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "Price");

            migrationBuilder.DropTable(
                name: "PriceList");

            migrationBuilder.DropTable(
                name: "SeatArrangement");

            migrationBuilder.DropTable(
                name: "Segment");

            migrationBuilder.DropTable(
                name: "UnavailableDate");

            migrationBuilder.DropTable(
                name: "VehicleReservation");

            migrationBuilder.DropTable(
                name: "Seats");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "Flights");

            migrationBuilder.DropTable(
                name: "RentACars");

            migrationBuilder.DropTable(
                name: "Airlines");
        }
    }
}
