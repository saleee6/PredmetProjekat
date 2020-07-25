using Careoplane.Database;
using Careoplane.Models;

namespace Careoplane.TOModels
{
    public class TOPassengerSeat
    {
        public int FlightReservationDetailId { get; set; }
        public int PassengerSeatId { get; set; }
        public TOSeat Seat { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Passport { get; set; }

        public bool Accepted { get; set; }
        public bool AirlineScored { get; set; }
        public bool FlightScored { get; set; }

        public TOPassengerSeat() { }
        public TOPassengerSeat(PassengerSeat passengerSeat, DatabaseContext _context, int id)
        {
            PassengerSeatId = passengerSeat.PassengerSeatId;
            FlightReservationDetailId = passengerSeat.FlightReservationDetail.FlightReservationDetailId;
            Seat = new TOSeat(_context.Seats.Find(passengerSeat.SeatId));
            Seat.FlightId = id;
            Username = passengerSeat.Username;
            Name = passengerSeat.Name;
            Surname = passengerSeat.Surname;
            Passport = passengerSeat.Passport;
            Accepted = passengerSeat.Accepted;
            AirlineScored = passengerSeat.AirlineScored;
            FlightScored = passengerSeat.FlightScored;
        }
    }
}