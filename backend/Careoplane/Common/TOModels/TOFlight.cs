using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Common.TOModels
{
    public class TOFlight
    {
        public int FlightId { get; set; }

        public string AirlineName { get; set; }

        public string Origin { get; set; }

        public string Destination { get; set; }

        public string Departure { get; set; }

        public string Arrival { get; set; }

        public double Distance { get; set; }
        public double Rating { get; set; }

        public List<TOPrimaryObject> Connections { get; set; }
        public List<TOPriceSegmentSeat> SeatingArangement { get; set; }
        public List<TOPriceSegmentSeat> Segments { get; set; }
        public List<TOSeat> Seats { get; set; }
        public List<double> Prices { get; set; }
        public int Version { get; set; }


        public TOFlight() { }
        //public TOFlight(Flight flight) {
        //    if(flight.Airline != null)
        //        AirlineName = flight.Airline.Name;
        //    Arrival = flight.Arrival.ToString();
        //    Departure = flight.Departure.ToString();
        //    Distance = flight.Distance;
        //    FlightId = flight.FlightId;
        //    Origin = flight.Origin;
        //    Destination = flight.Destination;
        //    Version = flight.Version;

        //    Prices = new List<double>();
            
        //    if (flight.Airline != null)
        //        if (flight.Airline.Prices != null)
        //        {
        //            List<Price> prices = flight.Airline.Prices.ToList();
        //            Prices.Add(Distance * prices[0].Value);
        //            Prices.Add(Distance * prices[1].Value);
        //            Prices.Add(Distance * prices[2].Value);
        //        }

        //    Connections = new List<TOPrimaryObject>();
        //    if(flight.Connections != null)
        //        foreach (var connection in flight.Connections)
        //        {
        //            Connections.Add(new TOPrimaryObject(connection.ConntectionId, connection.Value, connection.Flight.FlightId));
        //        }

        //    Segments = new List<TOPriceSegmentSeat>();
        //    if (flight.SegmentLengths != null)
        //        foreach (var segment in flight.SegmentLengths)
        //        {
        //            Segments.Add(new TOPriceSegmentSeat(segment.SegmentFlightId, segment.Value, segment.Ordinal, segment.Flight.FlightId.ToString()));
        //        }
        //    Segments = Segments.OrderBy(f => f.Ordinal).ToList();

        //    SeatingArangement = new List<TOPriceSegmentSeat>();
        //    if (flight.SeatingArrangements != null)
        //        foreach (var seatArrangement in flight.SeatingArrangements)
        //        {
        //            SeatingArangement.Add(new TOPriceSegmentSeat(seatArrangement.SeatArrangementFlightId, seatArrangement.Value, seatArrangement.Ordinal , seatArrangement.Flight.FlightId.ToString()));
        //        }
        //    SeatingArangement = SeatingArangement.OrderBy(f => f.Ordinal).ToList();

        //    if (flight.Ratings != null && flight.Ratings.Count != 0)
        //    {
        //        int sum = 0;
        //        foreach(var rating in flight.Ratings)
        //        {
        //            sum += rating.Value;
        //        }

        //        Rating = sum / flight.Ratings.Count();
        //    }

        //    Seats = new List<TOSeat>();
        //    if (flight.Seats != null)
        //        foreach (var seat in flight.Seats)
        //        {
        //            Seats.Add(new TOSeat(seat));
        //        }
        //}
    }
}
