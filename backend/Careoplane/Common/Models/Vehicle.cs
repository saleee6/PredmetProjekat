using Common.TOModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Common.Models
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        [Required]
        public string Brand { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public int NumOfSeats { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public double PricePerDay { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public double Rating { get; set; }

        [Required]
        public ICollection<UnavailableDate> UnavailableDates { get; set; }

        [Required]
        public bool IsOnSale { get; set; }

        [Required]
        public RentACar RentACar { get; set; }

        public ICollection<VehicleRating> Ratings { get; set; }

        public int Version { get; set; }

        public void FromTO(TOVehicle toVehicle, RentACar rentACar)
        {
            Brand = toVehicle.Brand;
            IsOnSale = toVehicle.IsOnSale;
            Location = toVehicle.Location;
            NumOfSeats = toVehicle.NumOfSeats;
            PricePerDay = toVehicle.PricePerDay;
            Rating = toVehicle.Rating;
            RentACar = rentACar;
            Type = toVehicle.Type;
            UnavailableDates = new List<UnavailableDate>();
            toVehicle.UnavailableDates.ToList().ForEach(date =>
            {
                DateTime newDate = DateTime.Parse(date.Value.ToString());
                UnavailableDates.Add(new UnavailableDate()
                {
                    DateId = 0,
                    Date = newDate,
                    Vehicle = this
                });
            });
            VehicleId = toVehicle.VehicleId;
            Year = toVehicle.Year;
            Version = toVehicle.Version;
        }

        public TOVehicle ToTO()
        {
            TOVehicle toVehicle = new TOVehicle();
            toVehicle.Brand = Brand;
            toVehicle.IsOnSale = IsOnSale;
            toVehicle.Location = Location;
            toVehicle.NumOfSeats = NumOfSeats;
            toVehicle.PricePerDay = PricePerDay;
            double ratingSum = 0;
            if (Ratings.Count != 0)
            {
                Ratings.ToList().ForEach(rating => ratingSum += rating.VehicleRatingValue);
                toVehicle.Rating = ratingSum / Ratings.Count;
            }
            else
            {
                toVehicle.Rating = 0;
            }
            toVehicle.RentACar = RentACar.Name;
            toVehicle.Type = Type;
            toVehicle.UnavailableDates = new List<TOPrimaryObject>();
            UnavailableDates.ToList().ForEach(date => toVehicle.UnavailableDates.Add(
                new TOPrimaryObject() 
                { 
                    Id = 0,
                    Value = date.Date.ToShortDateString(), 
                    Reference = this 
                }));
            toVehicle.VehicleId = VehicleId;
            toVehicle.Year = Year;
            toVehicle.Version = Version;

            return toVehicle;
        }
    }

    public class UnavailableDate
    {
        [Key]
        public int DateId { get; set; }
        public DateTime Date { get; set; }

        [Required]
        public Vehicle Vehicle { get; set; }
    }

    public class VehicleRating
    {
        [Key]
        public int VehicleRatingId { get; set; }

        public int VehicleRatingValue { get; set; }

        [Required]
        public Vehicle Vehicle { get; set; }
    }
}
