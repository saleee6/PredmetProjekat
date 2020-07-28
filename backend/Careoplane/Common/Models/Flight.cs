//using Careoplane.Database;
//using Common.TOModels;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using System.Linq;
//using System.Threading.Tasks;

//namespace Common.Models
//{
//    public class Flight
//    {
//        [Key]
//        public int FlightId { get; set; }

//        [Required]
//        public Airline Airline { get; set; }

//        public string Origin { get; set; }

//        public string Destination { get; set; }

//        public DateTime Departure { get; set; }

//        public DateTime Arrival { get; set; }

//        public double Distance { get; set; }

//        public ICollection<Connection> Connections { get; set; }

//        public ICollection<Seat> Seats { get; set; }

//        public ICollection<SeatArrangementFlight> SeatingArrangements { get; set; }

//        public ICollection<SegmentFlight> SegmentLengths { get; set; }

//        public ICollection<FlightRating> Ratings { get; set; }
//        public int Version { get; set; }

//        public Flight() { }

//        public Flight(TOFlight flight, DatabaseContext _context) {

//            Airline = _context.Airlines.Include(a=>a.SeatingArrangements).Include(a=>a.SegmentLengths).Include(a => a.Prices).FirstOrDefault(a => a.Name == flight.AirlineName);
//            Arrival = DateTime.Parse(flight.Arrival);
//            Departure = DateTime.Parse(flight.Departure);
//            Distance = flight.Distance;
//            FlightId = flight.FlightId;
//            Origin = flight.Origin;
//            Destination = flight.Destination;
//            Version = flight.Version;
//        }

//        public DateTime ConvertJsDate(string jsDate)
//        {
//            string formatString = "ddd MMM d yyyy HH:mm:ss";

//            var gmtIndex = jsDate.IndexOf(" GMT");
//            if (gmtIndex > -1)
//            {
//                jsDate = jsDate.Remove(gmtIndex);
//                return DateTime.ParseExact(jsDate, formatString, null);
//            }
//            return DateTime.Parse(jsDate);
//        }

//        public void GenerateSeats()
//        {
//            this.Seats = new List<Seat>();

//            int count = 1;
//            char[] characters = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' };
//            double sum = 0;

//            for(int i = 0; i < Airline.SeatingArrangements.Count; i++)
//            {
//                sum += Airline.SeatingArrangements.ToList()[i].Value;
//            }

//            for(int i = 0; i < Airline.SegmentLengths.Count; i++)
//            {
//                string type = "";

//                if (i == 0)
//                {
//                    type = "first";
//                }
//                else if (i == 1)
//                {
//                    type = "business";
//                }
//                else
//                {
//                    type = "economy";
//                }

//                for(int j = 0; j < Airline.SegmentLengths.ToList()[i].Value; j++)
//                {
//                    for(int k = 0; k < sum; k++)
//                    {
//                        Seats.Add(new Seat()
//                        {
//                            Discount = 0,
//                            Flight = this,
//                            Name = count.ToString() + characters[k],
//                            Occupied = false,
//                            Price = Airline.Prices.ToList()[i].Value * Distance,
//                            SeatId = 0,
//                            Type = type
//                        });
//                    }
//                    count++;
//                }
//            }
//        }
//    }

//    public class Connection
//    {
//        [Key]
//        public int ConntectionId { get; set; }

//        public string Value { get; set; }

//        [Required]
//        public Flight Flight { get; set; }

//        public Connection() { }
//        public Connection(int id, string value, Flight flight) { ConntectionId = id; Value = value; Flight = flight; }
//    }

//    public class SeatArrangementFlight
//    {
//        [Key]
//        public int SeatArrangementFlightId { get; set; }

//        public double Value { get; set; }

//        public int Ordinal { get; set; }

//        [Required]
//        public Flight Flight { get; set; }
//    }

//    public class SegmentFlight
//    {
//        [Key]
//        public int SegmentFlightId { get; set; }

//        public double Value { get; set; }

//        public int Ordinal { get; set; }

//        [Required]
//        public Flight Flight { get; set; }
//    }

//    public class FlightRating
//    {
//        [Key]
//        public int FlightRatingId { get; set; }

//        public int Value { get; set; }

//        [Required]
//        public Flight Flight { get; set; }
//    }
//}
