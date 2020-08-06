using AirlineMicroservice.TOModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace AirlineMicroservice.Models
{
    public class Airline
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None), MaxLength(20)]
        public string Name { get; set; }

        public string Address { get; set; }

        public string Description { get; set; }

        public ICollection<Price> Prices { get; set; }

        public ICollection<SeatArrangement> SeatingArrangements { get; set; }

        public ICollection<Segment> SegmentLengths { get; set; }

        public ICollection<Flight> Flights { get; set; }

        public string Image { get; set; }

        public double Rating { get; set; }

        public ICollection<Destination> Destinations { get; set; }

        public ICollection<FastTicket> FastTickets { get; set; }

        public ICollection<ArilineRating> Ratings { get; set; }

        public Airline() { }
        public Airline(TOAirline airline) {
            Name = airline.Name;
            Address = airline.Address;
            Description = airline.Description;
            Image = airline.Image;
            Rating = airline.Rating;
        }
    }

    public class Destination
    {
        [Key]
        public int DestinationId { get; set; }

        public string Value { get; set; }

        [Required]
        public Airline Airline { get; set; }
    }

    public class Price
    {
        [Key]
        public int PriceId { get; set; }

        public double Value { get; set; }

        public int Ordinal { get; set; }

        [Required]
        public Airline Airline { get; set; }
    }

    public class SeatArrangement
    {
        [Key]
        public int SeatArrangementId { get; set; }

        public double Value { get; set; }

        public int Ordinal { get; set; }

        [Required]
        public Airline Airline { get; set; }
    }

    public class Segment
    {
        [Key]
        public int SegmentId { get; set; }

        public double Value { get; set; }

        public int Ordinal { get; set; }

        [Required]
        public Airline Airline { get; set; }
    }

    public class ArilineRating
    {
        [Key]
        public int AirlineRatingId { get; set; }

        public int Value { get; set; }

        [Required]
        public Airline Airline { get; set; }
    }
}
