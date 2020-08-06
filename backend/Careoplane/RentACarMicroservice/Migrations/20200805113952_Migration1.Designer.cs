﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RentACarMicroservice.Database;

namespace RentACarMicroservice.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20200805113952_Migration1")]
    partial class Migration1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Common.Models.Discount", b =>
                {
                    b.Property<int>("DiscountId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<double>("DiscountValue")
                        .HasColumnType("double");

                    b.Property<string>("Type")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("DiscountId");

                    b.ToTable("Discount");
                });

            modelBuilder.Entity("Common.Models.Location", b =>
                {
                    b.Property<int>("LocationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("LocationValue")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("RentACarName")
                        .IsRequired()
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4");

                    b.HasKey("LocationId");

                    b.HasIndex("RentACarName");

                    b.ToTable("Location");
                });

            modelBuilder.Entity("Common.Models.PriceList", b =>
                {
                    b.Property<int>("PriceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("PriceService")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<double>("PriceValue")
                        .HasColumnType("double");

                    b.Property<string>("RentACarName")
                        .IsRequired()
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4");

                    b.HasKey("PriceId");

                    b.HasIndex("RentACarName");

                    b.ToTable("PriceList");
                });

            modelBuilder.Entity("Common.Models.RentACar", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4")
                        .HasMaxLength(20);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<double>("Rating")
                        .HasColumnType("double");

                    b.HasKey("Name");

                    b.ToTable("RentACars");
                });

            modelBuilder.Entity("Common.Models.RentACarRating", b =>
                {
                    b.Property<int>("RentACarRatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("RentACarName")
                        .IsRequired()
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4");

                    b.Property<int>("RentACarRatingValue")
                        .HasColumnType("int");

                    b.HasKey("RentACarRatingId");

                    b.HasIndex("RentACarName");

                    b.ToTable("RentACarRating");
                });

            modelBuilder.Entity("Common.Models.UnavailableDate", b =>
                {
                    b.Property<int>("DateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasKey("DateId");

                    b.HasIndex("VehicleId");

                    b.ToTable("UnavailableDate");
                });

            modelBuilder.Entity("Common.Models.Vehicle", b =>
                {
                    b.Property<int>("VehicleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Brand")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<bool>("IsOnSale")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("NumOfSeats")
                        .HasColumnType("int");

                    b.Property<double>("PricePerDay")
                        .HasColumnType("double");

                    b.Property<double>("Rating")
                        .HasColumnType("double");

                    b.Property<string>("RentACarName")
                        .IsRequired()
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("VehicleId");

                    b.HasIndex("RentACarName");

                    b.ToTable("Vehicles");
                });

            modelBuilder.Entity("Common.Models.VehicleRating", b =>
                {
                    b.Property<int>("VehicleRatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.Property<int>("VehicleRatingValue")
                        .HasColumnType("int");

                    b.HasKey("VehicleRatingId");

                    b.HasIndex("VehicleId");

                    b.ToTable("VehicleRating");
                });

            modelBuilder.Entity("Common.Models.VehicleReservation", b =>
                {
                    b.Property<int>("ReservationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FromLocation")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<bool>("IsRentACarRated")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsVehicleRated")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("NumOfDays")
                        .HasColumnType("int");

                    b.Property<double>("Price")
                        .HasColumnType("double");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("ToLocation")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasKey("ReservationId");

                    b.ToTable("VehicleReservation");
                });

            modelBuilder.Entity("Common.Models.Location", b =>
                {
                    b.HasOne("Common.Models.RentACar", "RentACar")
                        .WithMany("Locations")
                        .HasForeignKey("RentACarName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Common.Models.PriceList", b =>
                {
                    b.HasOne("Common.Models.RentACar", "RentACar")
                        .WithMany("Prices")
                        .HasForeignKey("RentACarName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Common.Models.RentACarRating", b =>
                {
                    b.HasOne("Common.Models.RentACar", "RentACar")
                        .WithMany("Ratings")
                        .HasForeignKey("RentACarName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Common.Models.UnavailableDate", b =>
                {
                    b.HasOne("Common.Models.Vehicle", "Vehicle")
                        .WithMany("UnavailableDates")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Common.Models.Vehicle", b =>
                {
                    b.HasOne("Common.Models.RentACar", "RentACar")
                        .WithMany("Vehicles")
                        .HasForeignKey("RentACarName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Common.Models.VehicleRating", b =>
                {
                    b.HasOne("Common.Models.Vehicle", "Vehicle")
                        .WithMany("Ratings")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}