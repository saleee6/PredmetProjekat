using Careoplane.Database;
using Careoplane.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.TOModels
{
    public class TOFastTicket
    {
        public TOSeat Seat { get; set; }

        public string AirlineName { get; set; }
        public double NewPrice { get; set; }

        public TOFastTicket() { }
        public TOFastTicket(FastTicket fastTicket, DatabaseContext _context) {
            Seat = new TOSeat(_context.Seats.Find(fastTicket.SeatId));
            AirlineName = fastTicket.Airline.Name;
            NewPrice = fastTicket.NewPrice;
        }
    }
}
