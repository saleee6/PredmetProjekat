using Careoplane.Database;
using Careoplane.TOModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.Models
{
    public class Seat
    {
        [Key]
        public int SeatId { get; set; }

        public string Name { get; set; }

        [Required]
        public Flight Flight { get; set; }

        public string Type { get; set; }

        public bool Occupied { get; set; }

        public double Discount { get; set; }

        public double Price { get; set; }

        public Seat() { }

        public Seat(TOSeat seat, DatabaseContext _context)
        {
            Name = seat.Name;
            Discount = seat.Discount;
            Flight = _context.Flights.Find(seat.FlightId);
            Occupied = seat.Occupied;
            SeatId = seat.SeatId;
            Type = seat.Type;
            Price = seat.Price;
        }
    }
}