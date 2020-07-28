//using Careoplane.Database;
//using Common.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Security.Cryptography;
//using System.Threading.Tasks;

//namespace Common.TOModels
//{
//    public class TOAirline
//    {
//        public string Name { get; set; }
//        public string Address { get; set; }
//        public string Description { get; set; }
//        public List<TOPriceSegmentSeat> Prices { get; set; }
//        public List<TOPriceSegmentSeat> SeatingArrangements { get; set; }
//        public List<TOPriceSegmentSeat> SegmentLengths { get; set; }
//        public List<TOFlight> Flights { get; set; }
//        public string Image { get; set; }
//        public double Rating { get; set; }
//        public List<TOPrimaryObject> Destinations { get; set; }
//        public List<TOFastTicket> FastTickets { get; set; }

//        public TOAirline() { }
//        public TOAirline(Airline airline, DatabaseContext _context)
//        {
//            Name = airline.Name;
//            Address = airline.Address;
//            Description = airline.Description;
//            Image = airline.Image;
//            Rating = airline.Rating;

//            FastTickets = new List<TOFastTicket>();

//            if (airline.FastTickets != null)
//                foreach (FastTicket fastTicket in airline.FastTickets)
//                {
//                    FastTickets.Add(new TOFastTicket(fastTicket, _context));
//                }

//            Destinations = new List<TOPrimaryObject>();
//            if (airline.Destinations != null)
//                foreach (Destination destination in airline.Destinations)
//                {
//                    Destinations.Add(new TOPrimaryObject(destination.DestinationId, destination.Value, destination.Airline.Name));
//                }

//            Prices = new List<TOPriceSegmentSeat>();
//            if (airline.Prices != null)
//            {
//                foreach (Price price in airline.Prices)
//                {
//                    Prices.Add(new TOPriceSegmentSeat(price.PriceId, price.Value, price.Ordinal, price.Airline.Name));
//                }
//                Prices = Prices.OrderBy(x => x.Ordinal).ToList();
//            }

//            SegmentLengths = new List<TOPriceSegmentSeat>();
//            if (airline.SegmentLengths != null)
//            {
//                foreach (Segment segment in airline.SegmentLengths)
//                {
//                    SegmentLengths.Add(new TOPriceSegmentSeat(segment.SegmentId, segment.Value, segment.Ordinal, segment.Airline.Name));
//                }
//                SegmentLengths = SegmentLengths.OrderBy(x => x.Ordinal).ToList();
//            }

//            SeatingArrangements = new List<TOPriceSegmentSeat>();
//            if (airline.SeatingArrangements != null)
//            {
//                foreach (SeatArrangement seat in airline.SeatingArrangements)
//                {
//                    SeatingArrangements.Add(new TOPriceSegmentSeat(seat.SeatArrangementId, seat.Value, seat.Ordinal, seat.Airline.Name));
//                }
//                SeatingArrangements = SeatingArrangements.OrderBy(x => x.Ordinal).ToList();
//            }

//            Flights = new List<TOFlight>();
//            if (airline.Flights != null)
//                foreach (Flight flight in airline.Flights)
//                {
//                    Flights.Add(new TOFlight(flight));
//                }
//        }
//    }
//}
