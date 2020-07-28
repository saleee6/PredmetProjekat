using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Common.TOModels
{
    public class TOVehicleReservation
    {
        public int ReservationId { get; set; }

        //public TOVehicle Vehicle { get; set; }
        public int VehicleId { get; set; }
        
        public string FromDate { get; set; }
        
        public string FromLocation { get; set; }
        
        public string ToDate { get; set; }
        
        public string ToLocation { get; set; }
        
        public int NumOfDays { get; set; }
        
        public double Price { get; set; }
        
        public string Type { get; set; }

        public string UserName { get; set; }

        public TORentACar RentACar { get; set; }

        public string CreationDate { get; set; }

        public bool IsVehicleRated { get; set; }

        public bool IsRentACarRated { get; set; }
    }
}
