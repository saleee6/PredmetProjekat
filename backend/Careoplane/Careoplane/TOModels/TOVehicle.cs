using Careoplane.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.TOModels
{
    public class TOVehicle
    {
        public int VehicleId { get; set; }
   
        //public string Title { get; set; }
        
        public string Brand { get; set; }
        
        public string Type { get; set; }
        
        public int NumOfSeats { get; set; }
        
        public int Year { get; set; }
        
        public double PricePerDay { get; set; }
        
        public string Location { get; set; }
        
        public double Rating { get; set; }
        
        public ICollection<TOPrimaryObject> UnavailableDates { get; set; }
        
        public bool IsOnSale { get; set; }
        
        public string RentACar { get; set; }

        public int Version { get; set; }

    }
}
