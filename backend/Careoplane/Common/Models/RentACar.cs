using Common.TOModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Common.Models
{
    public class RentACar
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None), MaxLength(20)]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string Description { get; set; }

        public ICollection<Vehicle> Vehicles { get; set; }

        public ICollection<Location> Locations { get; set; }

        public double Rating { get; set; }

        public ICollection<PriceList> Prices { get; set; }

        public ICollection<RentACarRating> Ratings { get; set; }

        public RentACar() { }

        public void FromTO(TORentACar toRentACar)
        {
            Name = toRentACar.Name;
            Address = toRentACar.Address;
            Description = toRentACar.Description;
            Rating = toRentACar.Rating;
            Vehicles = new List<Vehicle>();
            Locations = new List<Location>();
            Prices = new List<PriceList>();
            toRentACar.Vehicles.ToList().ForEach(vehicle => 
            {
                Vehicle vehicleObj = new Vehicle();
                vehicleObj.FromTO(vehicle, this);
                Vehicles.Add(vehicleObj);
            }) ;
            toRentACar.Locations.ToList().ForEach(location => Locations.Add(
                new Location()
                {
                    LocationId = 0,
                    LocationValue = location.Value.ToString(),
                    RentACar = this
                }));
            Prices.Add(new PriceList()
            { PriceValue = (Int64)(toRentACar.Prices.ToList()[0].Value),
              PriceService = "Car",
              RentACar = this });
            Prices.Add(new PriceList()
            {
                PriceValue = (Int64)(toRentACar.Prices.ToList()[1].Value),
                PriceService = "Van",
                RentACar = this
            });
            Prices.Add(new PriceList()
            {
                PriceValue = (Int64)(toRentACar.Prices.ToList()[2].Value),
                PriceService = "Truck",
                RentACar = this
            });
            //toRentACar.Prices.ToList().ForEach(price => Prices.Add(new PriceList()
            //{  }));
        }

        public TORentACar ToTO()
        {
            TORentACar toRentACar = new TORentACar();
            toRentACar.Name = Name;
            toRentACar.Address = Address;
            toRentACar.Description = Description;
            double ratingSum = 0;
            if (Ratings.Count != 0)
            {
                Ratings.ToList().ForEach(rating => ratingSum += rating.RentACarRatingValue);
                toRentACar.Rating = ratingSum / Ratings.Count;
            } else
            {
                toRentACar.Rating = 0;
            }
            toRentACar.Vehicles = new List<TOVehicle>();
            toRentACar.Locations = new List<TOPrimaryObject>();
            toRentACar.Prices = new List<TOPrimaryObject>();
            Vehicles.ToList().ForEach(vehicle => toRentACar.Vehicles.Add(vehicle.ToTO()));
            Locations.ToList().ForEach(location => toRentACar.Locations.Add(
                new TOPrimaryObject() { 
                    Id = 0, 
                    Value = location.LocationValue, 
                    Reference = this 
                }));
            Prices.ToList().ForEach(price => toRentACar.Prices.Add(
                new TOPrimaryObject() { 
                    Id = 0,
                    Value = (Int64)(price.PriceValue), 
                    Reference = this 
                }));

            return toRentACar;
        }
    }

    public class Location
    {
        [Key]
        public int LocationId { get; set; }

        public string LocationValue { get; set; }

        [Required]
        public RentACar RentACar { get; set; }
    }

    public class PriceList
    {
        [Key]
        public int PriceId { get; set; }

        public double PriceValue { get; set; }

        public string PriceService { get; set; }

        [Required]
        public RentACar RentACar { get; set; }
    }

    public class RentACarRating
    {
        [Key]
        public int RentACarRatingId { get; set; }

        public int RentACarRatingValue { get; set; }

        [Required]
        public RentACar RentACar { get; set; }
    }
}

