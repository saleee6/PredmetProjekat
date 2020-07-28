﻿// <auto-generated />
using System;
using AirlineMicroservice.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AirlineMicroservice.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("AirlineMicroservice.Models.Airline", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Rating")
                        .HasColumnType("float");

                    b.HasKey("Name");

                    b.ToTable("Airlines");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.ArilineRating", b =>
                {
                    b.Property<int>("AirlineRatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Value")
                        .HasColumnType("int");

                    b.HasKey("AirlineRatingId");

                    b.HasIndex("AirlineName");

                    b.ToTable("ArilineRating");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Connection", b =>
                {
                    b.Property<int>("ConntectionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ConntectionId");

                    b.HasIndex("FlightId");

                    b.ToTable("Connection");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Destination", b =>
                {
                    b.Property<int>("DestinationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("DestinationId");

                    b.HasIndex("AirlineName");

                    b.ToTable("Destination");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FastTicket", b =>
                {
                    b.Property<int>("SeatId")
                        .HasColumnType("int");

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<double>("NewPrice")
                        .HasColumnType("float");

                    b.HasKey("SeatId");

                    b.HasIndex("AirlineName");

                    b.ToTable("FastTickets");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Flight", b =>
                {
                    b.Property<int>("FlightId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("Arrival")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Departure")
                        .HasColumnType("datetime2");

                    b.Property<string>("Destination")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Distance")
                        .HasColumnType("float");

                    b.Property<string>("Origin")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("FlightId");

                    b.HasIndex("AirlineName");

                    b.ToTable("Flights");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FlightRating", b =>
                {
                    b.Property<int>("FlightRatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<int>("Value")
                        .HasColumnType("int");

                    b.HasKey("FlightRatingId");

                    b.HasIndex("FlightId");

                    b.ToTable("FlightRating");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FlightReservation", b =>
                {
                    b.Property<int>("ReservationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("FinalPrice")
                        .HasColumnType("float");

                    b.Property<DateTime>("TimeOfCreation")
                        .HasColumnType("datetime2");

                    b.Property<int>("VehicleReservationId")
                        .HasColumnType("int");

                    b.HasKey("ReservationId");

                    b.ToTable("FlightReservations");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FlightReservationDetail", b =>
                {
                    b.Property<int>("FlightReservationDetailId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<int>("FlightReservationReservationId")
                        .HasColumnType("int");

                    b.HasKey("FlightReservationDetailId");

                    b.HasIndex("FlightReservationReservationId");

                    b.ToTable("FlightReservationDetail");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.PassengerSeat", b =>
                {
                    b.Property<int>("PassengerSeatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("Accepted")
                        .HasColumnType("bit");

                    b.Property<bool>("AirlineScored")
                        .HasColumnType("bit");

                    b.Property<int>("FlightReservationDetailId")
                        .HasColumnType("int");

                    b.Property<bool>("FlightScored")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Passport")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SeatId")
                        .HasColumnType("int");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PassengerSeatId");

                    b.HasIndex("FlightReservationDetailId");

                    b.ToTable("PassengerSeat");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Price", b =>
                {
                    b.Property<int>("PriceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Ordinal")
                        .HasColumnType("int");

                    b.Property<double>("Value")
                        .HasColumnType("float");

                    b.HasKey("PriceId");

                    b.HasIndex("AirlineName");

                    b.ToTable("Price");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Seat", b =>
                {
                    b.Property<int>("SeatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("Discount")
                        .HasColumnType("float");

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Occupied")
                        .HasColumnType("bit");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<string>("Type")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SeatId");

                    b.HasIndex("FlightId");

                    b.ToTable("Seats");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SeatArrangement", b =>
                {
                    b.Property<int>("SeatArrangementId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Ordinal")
                        .HasColumnType("int");

                    b.Property<double>("Value")
                        .HasColumnType("float");

                    b.HasKey("SeatArrangementId");

                    b.HasIndex("AirlineName");

                    b.ToTable("SeatArrangement");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SeatArrangementFlight", b =>
                {
                    b.Property<int>("SeatArrangementFlightId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<int>("Ordinal")
                        .HasColumnType("int");

                    b.Property<double>("Value")
                        .HasColumnType("float");

                    b.HasKey("SeatArrangementFlightId");

                    b.HasIndex("FlightId");

                    b.ToTable("SeatArrangementFlight");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Segment", b =>
                {
                    b.Property<int>("SegmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AirlineName")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Ordinal")
                        .HasColumnType("int");

                    b.Property<double>("Value")
                        .HasColumnType("float");

                    b.HasKey("SegmentId");

                    b.HasIndex("AirlineName");

                    b.ToTable("Segment");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SegmentFlight", b =>
                {
                    b.Property<int>("SegmentFlightId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FlightId")
                        .HasColumnType("int");

                    b.Property<int>("Ordinal")
                        .HasColumnType("int");

                    b.Property<double>("Value")
                        .HasColumnType("float");

                    b.HasKey("SegmentFlightId");

                    b.HasIndex("FlightId");

                    b.ToTable("SegmentFlight");
                });

            modelBuilder.Entity("AirlineMicroservice.Models.ArilineRating", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("Ratings")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Connection", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Flight", "Flight")
                        .WithMany("Connections")
                        .HasForeignKey("FlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Destination", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("Destinations")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FastTicket", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("FastTickets")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Flight", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("Flights")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FlightRating", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Flight", "Flight")
                        .WithMany("Ratings")
                        .HasForeignKey("FlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.FlightReservationDetail", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.FlightReservation", "FlightReservation")
                        .WithMany("FlightReservationDetails")
                        .HasForeignKey("FlightReservationReservationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.PassengerSeat", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.FlightReservationDetail", "FlightReservationDetail")
                        .WithMany("PassengerSeats")
                        .HasForeignKey("FlightReservationDetailId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Price", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("Prices")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Seat", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Flight", "Flight")
                        .WithMany("Seats")
                        .HasForeignKey("FlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SeatArrangement", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("SeatingArrangements")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SeatArrangementFlight", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Flight", "Flight")
                        .WithMany("SeatingArrangements")
                        .HasForeignKey("FlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.Segment", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Airline", "Airline")
                        .WithMany("SegmentLengths")
                        .HasForeignKey("AirlineName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AirlineMicroservice.Models.SegmentFlight", b =>
                {
                    b.HasOne("AirlineMicroservice.Models.Flight", "Flight")
                        .WithMany("SegmentLengths")
                        .HasForeignKey("FlightId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
