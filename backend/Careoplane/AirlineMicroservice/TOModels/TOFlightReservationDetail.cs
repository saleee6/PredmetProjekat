using AirlineMicroservice.Database;
using AirlineMicroservice.Models;
using SQLitePCL;
using System.Collections.Generic;

namespace AirlineMicroservice.TOModels
{
    public class TOFlightReservationDetail
    {
        public int FlightReservationId { get; set; }
        public int FlightReservationDetailId { get; set; }
        public TOFlight Flight { get; set; }
        public List<TOPassengerSeat> PassengerSeats { get; set; }

        public TOFlightReservationDetail() { }
        public TOFlightReservationDetail(FlightReservationDetail flightReservationDetail, DatabaseContext _context) {
            FlightReservationDetailId = flightReservationDetail.FlightReservationDetailId;
            FlightReservationId = flightReservationDetail.FlightReservation.ReservationId;

            Flight = new TOFlight(_context.Flights.Find(flightReservationDetail.FlightId));
            Flight.AirlineName = flightReservationDetail.AirlineName;

            PassengerSeats = new List<TOPassengerSeat>();

            foreach(PassengerSeat passengerSeat in flightReservationDetail.PassengerSeats)
            {
                PassengerSeats.Add(new TOPassengerSeat(passengerSeat,_context,Flight.FlightId));
            }
        }
    }
}