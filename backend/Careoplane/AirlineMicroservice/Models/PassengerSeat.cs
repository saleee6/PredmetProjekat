using System.ComponentModel.DataAnnotations;
using System.Data;

namespace AirlineMicroservice.Models
{
    public class PassengerSeat
    {
        [Required]
        public FlightReservationDetail FlightReservationDetail { get; set; }
        [Key]
        public int PassengerSeatId { get; set; }
        public int SeatId { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Passport { get; set; }
        public bool Accepted { get; set; }
        public bool AirlineScored { get; set; }
        public bool FlightScored { get; set; }

        public PassengerSeat() { }

    }
}