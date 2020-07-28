using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AirlineMicroservice.Migrations
{
    public partial class Migration1 : Migration
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
                name: "FlightReservations",
                columns: table => new
                {
                    ReservationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfCreation = table.Column<DateTime>(nullable: false),
                    Creator = table.Column<string>(nullable: true),
                    VehicleReservationId = table.Column<int>(nullable: false),
                    FinalPrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightReservations", x => x.ReservationId);
                });

            migrationBuilder.CreateTable(
                name: "ArilineRating",
                columns: table => new
                {
                    AirlineRatingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<int>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArilineRating", x => x.AirlineRatingId);
                    table.ForeignKey(
                        name: "FK_ArilineRating_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Destination",
                columns: table => new
                {
                    DestinationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: true),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destination", x => x.DestinationId);
                    table.ForeignKey(
                        name: "FK_Destination_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FastTickets",
                columns: table => new
                {
                    SeatId = table.Column<int>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false),
                    NewPrice = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FastTickets", x => x.SeatId);
                    table.ForeignKey(
                        name: "FK_FastTickets_Airlines_AirlineName",
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
                    AirlineName = table.Column<string>(nullable: false),
                    Origin = table.Column<string>(nullable: true),
                    Destination = table.Column<string>(nullable: true),
                    Departure = table.Column<DateTime>(nullable: false),
                    Arrival = table.Column<DateTime>(nullable: false),
                    Distance = table.Column<double>(nullable: false),
                    Version = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flights", x => x.FlightId);
                    table.ForeignKey(
                        name: "FK_Flights_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Price",
                columns: table => new
                {
                    PriceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
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
                    SeatArrangementId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatArrangement", x => x.SeatArrangementId);
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
                    SegmentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    AirlineName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Segment", x => x.SegmentId);
                    table.ForeignKey(
                        name: "FK_Segment_Airlines_AirlineName",
                        column: x => x.AirlineName,
                        principalTable: "Airlines",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FlightReservationDetail",
                columns: table => new
                {
                    FlightReservationDetailId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightReservationReservationId = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false),
                    AirlineName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightReservationDetail", x => x.FlightReservationDetailId);
                    table.ForeignKey(
                        name: "FK_FlightReservationDetail_FlightReservations_FlightReservationReservationId",
                        column: x => x.FlightReservationReservationId,
                        principalTable: "FlightReservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Connection",
                columns: table => new
                {
                    ConntectionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(nullable: true),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connection", x => x.ConntectionId);
                    table.ForeignKey(
                        name: "FK_Connection_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FlightRating",
                columns: table => new
                {
                    FlightRatingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightRating", x => x.FlightRatingId);
                    table.ForeignKey(
                        name: "FK_FlightRating_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SeatArrangementFlight",
                columns: table => new
                {
                    SeatArrangementFlightId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatArrangementFlight", x => x.SeatArrangementFlightId);
                    table.ForeignKey(
                        name: "FK_SeatArrangementFlight_Flights_FlightId",
                        column: x => x.FlightId,
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
                    Name = table.Column<string>(nullable: true),
                    FlightId = table.Column<int>(nullable: false),
                    Type = table.Column<string>(nullable: true),
                    Occupied = table.Column<bool>(nullable: false),
                    Discount = table.Column<double>(nullable: false),
                    Price = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seats", x => x.SeatId);
                    table.ForeignKey(
                        name: "FK_Seats_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SegmentFlight",
                columns: table => new
                {
                    SegmentFlightId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<double>(nullable: false),
                    Ordinal = table.Column<int>(nullable: false),
                    FlightId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SegmentFlight", x => x.SegmentFlightId);
                    table.ForeignKey(
                        name: "FK_SegmentFlight_Flights_FlightId",
                        column: x => x.FlightId,
                        principalTable: "Flights",
                        principalColumn: "FlightId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PassengerSeat",
                columns: table => new
                {
                    PassengerSeatId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightReservationDetailId = table.Column<int>(nullable: false),
                    SeatId = table.Column<int>(nullable: false),
                    Username = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),
                    Passport = table.Column<string>(nullable: true),
                    Accepted = table.Column<bool>(nullable: false),
                    AirlineScored = table.Column<bool>(nullable: false),
                    FlightScored = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PassengerSeat", x => x.PassengerSeatId);
                    table.ForeignKey(
                        name: "FK_PassengerSeat_FlightReservationDetail_FlightReservationDetailId",
                        column: x => x.FlightReservationDetailId,
                        principalTable: "FlightReservationDetail",
                        principalColumn: "FlightReservationDetailId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArilineRating_AirlineName",
                table: "ArilineRating",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_Connection_FlightId",
                table: "Connection",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Destination_AirlineName",
                table: "Destination",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_FastTickets_AirlineName",
                table: "FastTickets",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_FlightRating_FlightId",
                table: "FlightRating",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_FlightReservationDetail_FlightReservationReservationId",
                table: "FlightReservationDetail",
                column: "FlightReservationReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_AirlineName",
                table: "Flights",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_PassengerSeat_FlightReservationDetailId",
                table: "PassengerSeat",
                column: "FlightReservationDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_Price_AirlineName",
                table: "Price",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_SeatArrangement_AirlineName",
                table: "SeatArrangement",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_SeatArrangementFlight_FlightId",
                table: "SeatArrangementFlight",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_FlightId",
                table: "Seats",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_Segment_AirlineName",
                table: "Segment",
                column: "AirlineName");

            migrationBuilder.CreateIndex(
                name: "IX_SegmentFlight_FlightId",
                table: "SegmentFlight",
                column: "FlightId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArilineRating");

            migrationBuilder.DropTable(
                name: "Connection");

            migrationBuilder.DropTable(
                name: "Destination");

            migrationBuilder.DropTable(
                name: "FastTickets");

            migrationBuilder.DropTable(
                name: "FlightRating");

            migrationBuilder.DropTable(
                name: "PassengerSeat");

            migrationBuilder.DropTable(
                name: "Price");

            migrationBuilder.DropTable(
                name: "SeatArrangement");

            migrationBuilder.DropTable(
                name: "SeatArrangementFlight");

            migrationBuilder.DropTable(
                name: "Seats");

            migrationBuilder.DropTable(
                name: "Segment");

            migrationBuilder.DropTable(
                name: "SegmentFlight");

            migrationBuilder.DropTable(
                name: "FlightReservationDetail");

            migrationBuilder.DropTable(
                name: "Flights");

            migrationBuilder.DropTable(
                name: "FlightReservations");

            migrationBuilder.DropTable(
                name: "Airlines");
        }
    }
}
