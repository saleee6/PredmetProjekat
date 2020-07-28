using Common.TOModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;

namespace Common.Models
{
    public class VehicleReservation
    {
        [Key]
        public int ReservationId { get; set; }

        [Required]
        //public Vehicle Vehicle { get; set; }
        public int VehicleId { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public string FromLocation { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [Required]
        public string ToLocation { get; set; }

        [Required]
        public int NumOfDays { get; set; }

        [Required]
        public double Price { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        public bool IsVehicleRated { get; set; }

        public bool IsRentACarRated { get; set; }

        public void FromTO(TOVehicleReservation toVehicleReservation)
        {
            FromDate = DateTime.Parse(toVehicleReservation.FromDate);
            FromLocation = toVehicleReservation.FromLocation;
            NumOfDays = toVehicleReservation.NumOfDays;
            Price = toVehicleReservation.Price;
            ReservationId = toVehicleReservation.ReservationId;
            ToDate = DateTime.Parse(toVehicleReservation.ToDate);
            ToLocation = toVehicleReservation.ToLocation;
            Type = toVehicleReservation.Type;
            Vehicle vehicle = new Vehicle();
            RentACar rentACar = new RentACar();
            rentACar.FromTO(toVehicleReservation.RentACar);
            //vehicle.FromTO(toVehicleReservation.Vehicle, rentACar);
            VehicleId = toVehicleReservation.VehicleId;
            UserName = toVehicleReservation.UserName;
            CreationDate = DateTime.Now;
            IsVehicleRated = toVehicleReservation.IsVehicleRated;
            IsRentACarRated = toVehicleReservation.IsRentACarRated;
        }

        public TOVehicleReservation ToTO()
        {
            TOVehicleReservation toVehicleReservation = new TOVehicleReservation();
            toVehicleReservation.FromDate = FromDate.ToString();
            toVehicleReservation.FromLocation = FromLocation;
            toVehicleReservation.NumOfDays = NumOfDays;
            toVehicleReservation.Price = Price;
            toVehicleReservation.ReservationId = ReservationId;
            toVehicleReservation.ToDate = ToDate.ToString();
            toVehicleReservation.ToLocation = ToLocation;
            toVehicleReservation.Type = Type;
            //toVehicleReservation.Vehicle = Vehicle.ToTO();
            toVehicleReservation.VehicleId = VehicleId;
            toVehicleReservation.CreationDate = CreationDate.ToString();
            toVehicleReservation.IsVehicleRated = IsVehicleRated;
            toVehicleReservation.IsRentACarRated = IsRentACarRated;

            return toVehicleReservation;
        }
    }
}
