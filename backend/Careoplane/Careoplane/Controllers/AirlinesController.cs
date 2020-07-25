using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Careoplane.Database;
using Careoplane.Models;
using Careoplane.TOModels;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Careoplane.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirlinesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public AirlinesController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Details")]
        public async Task<ActionResult<IEnumerable<TOAirline>>> GetAirlinesDetails()
        {
            List<Airline> airlines = await _context.Airlines
                .Include(a => a.Destinations)
                .ToListAsync();
            List<TOAirline> result = new List<TOAirline>();
            airlines.ForEach(airline => result.Add(new TOAirline(airline, _context)));
            return result;
        }

        [HttpGet("Edit/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOAirline>> GetAirlineEdit(string id)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdmin" && role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            var airline = await _context.Airlines
                .Include(a => a.Destinations)
                .Include(a => a.SeatingArrangements)
                .Include(a => a.SegmentLengths)
                .Include(a => a.Prices)
                .FirstOrDefaultAsync(a => a.Name == id);

            if (airline == null)
            {
                return NotFound();
            }

            return new TOAirline(airline, _context);
        }

        [HttpGet("Display/{id}")]
        public async Task<ActionResult<TOAirline>> GetAirlineDisplay(string id)
        {
            var airline = await _context.Airlines
                .Include(a => a.Destinations)
                .Include(a => a.Prices)
                .Include(a => a.Flights).ThenInclude(f => f.Connections)
                .Include(a => a.Flights).ThenInclude(f => f.Airline)
                .Include(a => a.Flights).ThenInclude(f => f.Ratings)
                .Include(a => a.FastTickets)
                .Include(airline => airline.Ratings)
                .FirstOrDefaultAsync(a => a.Name == id);

            if (airline == null)
            {
                return NotFound();
            }

            int sum = 0;
            foreach(var rating in airline.Ratings)
            {
                sum += rating.Value;
            }

            if (airline.Ratings.Count() != 0)
                airline.Rating = sum / airline.Ratings.Count();
            else
                airline.Rating = 0;
            return new TOAirline(airline, _context);
        }

        [HttpGet("Admin/{id}")]
        public async Task<ActionResult<TOAirline>> GetAirlineAdmin(string id)
        {
            var airline = await _context.Airlines
                .Include(a => a.Destinations)
                .Include(a => a.Prices)
                .Include(a => a.Flights).ThenInclude(f => f.Connections)
                .Include(a => a.Flights).ThenInclude(f => f.Airline)
                .Include(a => a.Flights).ThenInclude(f => f.Ratings)
                .Include(a => a.Flights).ThenInclude(f => f.Seats)
                .Include(a => a.FastTickets)
                .Include(airline => airline.Ratings)
                .FirstOrDefaultAsync(a => a.Name == id);

            if (airline == null)
            {
                return NotFound();
            }

            int sum = 0;
            foreach (var rating in airline.Ratings)
            {
                sum += rating.Value;
            }

            if (airline.Ratings.Count() != 0)
                airline.Rating = sum / airline.Ratings.Count();
            else
                airline.Rating = 0;
            return new TOAirline(airline, _context);
        }

        [HttpGet("Destinations/{id}")]
        public async Task<ActionResult<IEnumerable<TOPrimaryObject>>> GetDestinations(string id)
        {
            var airline = await _context.Airlines
                .Include(a => a.Destinations)
                .FirstOrDefaultAsync(a => a.Name == id);

            if (airline == null)
            {
                return NotFound();
            }

            List<TOPrimaryObject> result = new List<TOPrimaryObject>();
            foreach(var destination in airline.Destinations)
            {
                result.Add(new TOPrimaryObject()
                {
                    Id = destination.DestinationId,
                    Reference = destination.Airline.Name,
                    Value = destination.Value
                });
            }

            result = result.OrderBy(d => d.Value).ToList();

            return result;
        }

        // PUT: api/Airlines/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutAirline(string id, TOAirline airline)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if(role != "aeroAdmin" && role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }


            if (id != airline.Name)
            {
                return BadRequest();
            }

            Airline tempAirline = new Airline(airline);

            Airline oldAirline = await _context.Airlines
                .Include(c => c.Destinations)
                .Include(c => c.SeatingArrangements)
                .Include(c => c.SegmentLengths)
                .Include(c => c.Prices)
                .Include(c => c.Flights).ThenInclude(c => c.Seats)
                .FirstOrDefaultAsync(c => c.Name == airline.Name);

            _context.Entry(oldAirline).CurrentValues.SetValues(tempAirline);

            #region destinations
            tempAirline.Destinations = new List<Destination>();
            foreach (var destination in airline.Destinations)
            {
                tempAirline.Destinations.Add(new Destination()
                {
                    Airline = tempAirline,
                    DestinationId = destination.Id,
                    Value = destination.Value.ToString()
                });
            }

            var destinations = oldAirline.Destinations.ToList();
            foreach (var destination in destinations)
            {
                var des = tempAirline.Destinations.SingleOrDefault(i => i.DestinationId == destination.DestinationId);
                if (des != null)
                    _context.Entry(destination).CurrentValues.SetValues(des);
                else
                    _context.Remove(destination);
            }

            foreach (var des in tempAirline.Destinations)
            {
                if (destinations.All(i => i.DestinationId != des.DestinationId))
                {
                    oldAirline.Destinations.Add(des);
                }
            }
            #endregion

            #region prices
            tempAirline.Prices = new List<Price>();
            foreach (var price in airline.Prices)
            {
                tempAirline.Prices.Add(new Price()
                {
                    Airline = tempAirline,
                    PriceId = price.Id,
                    Value = double.Parse(price.Value.ToString()),
                    Ordinal = price.Ordinal
                });
            }

            var prices = oldAirline.Prices.ToList();
            foreach (var price in prices)
            {
                var pri = tempAirline.Prices.SingleOrDefault(i => i.PriceId == price.PriceId);
                if (pri != null)
                    _context.Entry(price).CurrentValues.SetValues(pri);
                else
                    _context.Remove(price);
            }

            foreach (var pri in tempAirline.Prices)
            {
                if (prices.All(i => i.PriceId != pri.PriceId))
                {
                    oldAirline.Prices.Add(pri);
                }
            }

            foreach(Flight flight in oldAirline.Flights)
            {
                if(flight.Departure > DateTime.Now)
                {
                    foreach(Seat seat in flight.Seats)
                    {
                        if (!seat.Occupied)
                        {
                            switch (seat.Type)
                            {
                                case "first": seat.Price = airline.Prices[0].Value * flight.Distance; break;
                                case "business": seat.Price = airline.Prices[1].Value * flight.Distance; break;
                                case "economy": seat.Price = airline.Prices[2].Value * flight.Distance; break;
                            }

                            _context.Entry(seat).State = EntityState.Modified;
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            #endregion region

            #region segmentLength
            tempAirline.SegmentLengths = new List<Segment>();
            foreach (var segment in airline.SegmentLengths)
            {
                tempAirline.SegmentLengths.Add(new Segment()
                {
                    Airline = tempAirline,
                    SegmentId = segment.Id,
                    Value = int.Parse(segment.Value.ToString()),
                    Ordinal = segment.Ordinal
                });
            }

            var segmentLengths = oldAirline.SegmentLengths.ToList();
            foreach (var segmentLength in segmentLengths)
            {
                var segLen = tempAirline.SegmentLengths.SingleOrDefault(i => i.SegmentId == segmentLength.SegmentId);
                if (segLen != null)
                    _context.Entry(segmentLength).CurrentValues.SetValues(segLen);
                else
                    _context.Remove(segmentLength);
            }

            foreach (var segLen in tempAirline.SegmentLengths)
            {
                if (segmentLengths.All(i => i.SegmentId != segLen.SegmentId))
                {
                    oldAirline.SegmentLengths.Add(segLen);
                }
            }
            #endregion

            #region Seat
            tempAirline.SeatingArrangements = new List<SeatArrangement>();
            foreach (var seatArrangement in airline.SeatingArrangements)
            {
                tempAirline.SeatingArrangements.Add(new SeatArrangement()
                {
                    Airline = tempAirline,
                    SeatArrangementId = seatArrangement.Id,
                    Value = int.Parse(seatArrangement.Value.ToString()),
                    Ordinal = seatArrangement.Ordinal
                });
            }

            var seats = oldAirline.SeatingArrangements.ToList();
            foreach (var seat in seats)
            {
                var se = tempAirline.SeatingArrangements.SingleOrDefault(i => i.SeatArrangementId == seat.SeatArrangementId);
                if (se != null)
                    _context.Entry(seat).CurrentValues.SetValues(se);
                else
                    _context.Remove(seat);
            }

            foreach (var se in tempAirline.SeatingArrangements)
            {
                if (seats.All(i => i.SeatArrangementId != se.SeatArrangementId))
                {
                    oldAirline.SeatingArrangements.Add(se);
                }
            }
            #endregion

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AirlineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Airlines
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOAirline>> PostAirline(TOAirline airline)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            Airline tempAirline = new Airline(airline);

            _context.Airlines.Add(tempAirline);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AirlineExists(tempAirline.Name))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            tempAirline.Destinations = new List<Destination>();
            foreach(var destination in airline.Destinations)
            {
                tempAirline.Destinations.Add(new Destination()
                {
                    Airline = tempAirline,
                    DestinationId = destination.Id,
                    Value = destination.Value.ToString()
                }); ;
            }

            tempAirline.Prices = new List<Price>();
            foreach (var price in airline.Prices)
            {
                tempAirline.Prices.Add(new Price()
                {
                    Airline = tempAirline,
                    PriceId = price.Id,
                    Ordinal = price.Ordinal,
                    Value = double.Parse(price.Value.ToString())
                });
            }

            tempAirline.SegmentLengths = new List<Segment>();
            foreach (var segment in airline.SegmentLengths)
            {
                tempAirline.SegmentLengths.Add(new Segment()
                {
                    Airline = tempAirline,
                    SegmentId = segment.Id,
                    Ordinal = segment.Ordinal,
                    Value = int.Parse(segment.Value.ToString())
                });
            }

            tempAirline.SeatingArrangements = new List<SeatArrangement>();
            foreach (var seatArrangement in airline.SeatingArrangements)
            {
                tempAirline.SeatingArrangements.Add(new SeatArrangement()
                {
                    Airline = tempAirline,
                    SeatArrangementId = seatArrangement.Id,
                    Ordinal = seatArrangement.Ordinal,
                    Value = int.Parse(seatArrangement.Value.ToString())
                });
            }

            _context.Entry(tempAirline).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("Rate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RateAirline(JObject tempObject)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            string name = tempObject["id"].ToString();
            int rating = tempObject["rating"].ToObject<int>();
            int passengerSeatId = tempObject["passengerSeatId"].ToObject<int>();
            int reservationId = tempObject["reservationId"].ToObject<int>();

            var airline = await _context.Airlines.Include(airline => airline.Ratings).FirstAsync(airline => airline.Name == name);
            airline.Ratings.Add(new ArilineRating()
            {
                Airline = airline,
                AirlineRatingId = 0,
                Value = rating
            });

            _context.Entry(airline).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var reservation = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats)
                .FirstOrDefaultAsync(reservation => reservation.ReservationId == reservationId);

            foreach(var detail in reservation.FlightReservationDetails)
            {
                foreach(var passengerSeat in detail.PassengerSeats)
                {
                    if(passengerSeat.PassengerSeatId == passengerSeatId)
                    {
                        passengerSeat.AirlineScored = true;
                        break;
                    }
                }
            }

            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AirlineExists(string id)
        {
            return _context.Airlines.Any(e => e.Name == id);
        }
    }
}
