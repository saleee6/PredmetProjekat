using Common.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RentACarMicroservice.Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        //public DbSet<Discount> Discounts { get; set; }

        #region Rent A Car

        public DbSet<RentACar> RentACars { get; set; }

        public DbSet<Vehicle> Vehicles { get; set; }

        public DbSet<VehicleReservation> VehicleReservation { get; set; }

        public DbSet<Discount> Discount { get; set; }

        #endregion
    }
}
