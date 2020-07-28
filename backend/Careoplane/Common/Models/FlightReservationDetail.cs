using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Common.Models
{
    public class FlightReservationDetail
    {
        [Required]
        public FlightReservation FlightReservation { get; set; }
        [Key]
        public int FlightReservationDetailId { get; set; }

        public int FlightId { get; set; }
        public string AirlineName { get; set; }
        public List<PassengerSeat> PassengerSeats { get; set; }


        public FlightReservationDetail() { }
    }
}