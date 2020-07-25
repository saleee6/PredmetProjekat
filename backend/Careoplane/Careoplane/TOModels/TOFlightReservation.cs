using Careoplane.Database;
using Careoplane.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.TOModels
{
    public class TOFlightReservation
    {
        public int ReservationId { get; set; }
        public List<TOFlightReservationDetail> FlightReservationDetails { get; set; }
        public string Type { get; set; }
        public string TimeOfCreation { get; set; }
        public int VehicleReservationId { get; set; }
        public string Creator { get; set; }
        public double FinalPrice { get; set; }

        public TOFlightReservation() { }
        public TOFlightReservation(FlightReservation flightReservation, DatabaseContext _context) {
            ReservationId = flightReservation.ReservationId;
            FlightReservationDetails = new List<TOFlightReservationDetail>();
            TimeOfCreation = flightReservation.TimeOfCreation.ToString();
            Creator = flightReservation.Creator;
            VehicleReservationId = flightReservation.VehicleReservationId;
            FinalPrice = flightReservation.FinalPrice;

            if(VehicleReservationId == 0)
            {
                Type = "flight";
            }
            else
            {
                Type = "double";
            }

            foreach(FlightReservationDetail flightReservationDetail in flightReservation.FlightReservationDetails)
            {
                FlightReservationDetails.Add(new TOFlightReservationDetail(flightReservationDetail,_context));
            }
        }
    }
}
