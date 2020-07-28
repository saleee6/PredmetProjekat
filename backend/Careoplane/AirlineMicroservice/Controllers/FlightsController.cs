using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AirlineMicroservice.Database;
using Common.Models;
using Common.TOModels;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Newtonsoft.Json.Linq;
using System.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Careoplane.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        public FlightsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Flights/5
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<AirlineMicroservice.TOModels.TOFlight>> GetFlight(int id)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            //if (role != "aeroAdmin" && role != "regular")
            //{
            //    return BadRequest("You are not authorised to do this action");

            //}

            var flight = await _context.Flights
                .Include(f => f.Connections)
                .Include(f => f.SeatingArrangements)
                .Include(f => f.SegmentLengths)
                .Include(f => f.Seats).ThenInclude(s => s.Flight)
                .Include(f => f.Airline).ThenInclude(a => a.Prices)
                .FirstOrDefaultAsync(f => f.FlightId == id);

            if (flight == null)
            {
                return NotFound();
            }

            return new AirlineMicroservice.TOModels.TOFlight(flight);
        }

        [HttpGet]
        [Route("Searched")]    
        public async Task<ActionResult<IEnumerable<AirlineMicroservice.TOModels.TOFlight>>> GetSearchedFlights([FromQuery]string origin, [FromQuery]string destination, [FromQuery]string departure, [FromQuery]int numPassengers, [FromQuery]string classType, [FromQuery]string name, [FromQuery]bool notSingleAirline, [FromQuery]bool multi) {
            List<AirlineMicroservice.Models.Flight> flights = await _context.Flights
                .Include(f => f.Connections)
                .Include(f => f.SeatingArrangements)
                .Include(f => f.SegmentLengths)
                .Include(f => f.Seats).ThenInclude(s => s.Flight)
                .Include(f => f.Airline).ThenInclude(a => a.Prices)
                .ToListAsync();


            DateTime newDeparture = DateTime.Parse(departure);
            List<AirlineMicroservice.TOModels.TOFlight> returnList = new List<AirlineMicroservice.TOModels.TOFlight>();
            foreach (AirlineMicroservice.Models.Flight flight in flights)
            {
                if (flight.Origin.ToLower() == origin.ToLower() && flight.Destination.ToLower() == destination.ToLower() && flight.Departure.Date == newDeparture.Date && (notSingleAirline || flight.Airline.Name == name))
                {
                    int count = 0;
                    foreach (AirlineMicroservice.Models.Seat seat in flight.Seats)
                    {
                        if (seat.Type == classType || classType == "any")
                            if (!seat.Occupied)
                                count++;
                    }
                    if (count >= numPassengers)
                        if (multi)
                        {
                            if(flight.Connections.Count != 0)
                            {
                                returnList.Add(new AirlineMicroservice.TOModels.TOFlight(flight));
                            }
                        }
                        else
                        {
                            returnList.Add(new AirlineMicroservice.TOModels.TOFlight(flight));
                        }
                }
            }
            
            return returnList;
        }

        [HttpPut("Rate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RateFlight(JObject tempObject)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            int id = tempObject["id"].ToObject<int>();
            string username = tempObject["username"].ToString();
            int rating = tempObject["rating"].ToObject<int>();
            int passengerSeatId = tempObject["passengerSeatId"].ToObject<int>();
            int reservationId = tempObject["reservationId"].ToObject<int>();

            var flight = await _context.Flights.Include(flight => flight.Ratings).FirstAsync(flight => flight.FlightId == id);
            flight.Ratings.Add(new AirlineMicroservice.Models.FlightRating()
            {
                Flight = flight,
                FlightRatingId = 0,
                Value = rating
            });

            _context.Entry(flight).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();

            var reservation = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats)
                .FirstOrDefaultAsync(reservation => reservation.ReservationId == reservationId);

            foreach (var detail in reservation.FlightReservationDetails)
            {
                foreach (var passengerSeat in detail.PassengerSeats)
                {
                    if (passengerSeat.PassengerSeatId == passengerSeatId)
                    {
                        passengerSeat.FlightScored = true;
                        break;
                    }
                }
            }

            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Flights/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutFlight(int id, TOFlight flight)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdmin" && role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            if (id != flight.FlightId)
            {
                return BadRequest();
            }

            AirlineMicroservice.Models.Flight tempFlight = await _context.Flights.FindAsync(flight.FlightId);

            var success = false;

            if(tempFlight.Version != flight.Version)
            {
                return Ok(new { success });
            }

            tempFlight.Arrival = DateTime.Parse(flight.Arrival);
            tempFlight.Departure = DateTime.Parse(flight.Departure);
            tempFlight.Version++;
            
            _context.Entry(tempFlight).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            success = true;
            return Ok(new { success });
        }

        // POST: api/Flights
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<AirlineMicroservice.TOModels.TOFlight>> PostFlight(AirlineMicroservice.TOModels.TOFlight flight)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdminNew" && role != "aeroAdmin")
            {
                return BadRequest("You are not authorised to do this action");
            }

            AirlineMicroservice.Models.Flight tempFlight = new AirlineMicroservice.Models.Flight(flight, _context);
            tempFlight.Version = 0;
            _context.Flights.Add(tempFlight);
            await _context.SaveChangesAsync();

            tempFlight.Connections = new List<AirlineMicroservice.Models.Connection>();
            foreach(AirlineMicroservice.TOModels.TOPrimaryObject connection in flight.Connections)
            {
                tempFlight.Connections.Add(new AirlineMicroservice.Models.Connection()
                {
                    ConntectionId = 0,
                    Flight = tempFlight,
                    Value = connection.Value.ToString()
                });
            }

            tempFlight.GenerateSeats();

            tempFlight.SegmentLengths = new List<AirlineMicroservice.Models.SegmentFlight>();
            foreach (var segment in tempFlight.Airline.SegmentLengths)
            {
                tempFlight.SegmentLengths.Add(new AirlineMicroservice.Models.SegmentFlight()
                {
                    Flight = tempFlight,
                    SegmentFlightId = 0,
                    Ordinal = segment.Ordinal,
                    Value = int.Parse(segment.Value.ToString())
                });
            }

            tempFlight.SeatingArrangements = new List<AirlineMicroservice.Models.SeatArrangementFlight>();
            foreach (var seatArrangement in tempFlight.Airline.SeatingArrangements)
            {
                tempFlight.SeatingArrangements.Add(new AirlineMicroservice.Models.SeatArrangementFlight()
                {
                    Flight = tempFlight,
                    SeatArrangementFlightId = 0,
                    Ordinal = seatArrangement.Ordinal,
                    Value = int.Parse(seatArrangement.Value.ToString())
                });
            }

            _context.Entry(tempFlight).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFlight", new { id = tempFlight.FlightId }, new AirlineMicroservice.TOModels.TOFlight(tempFlight));
        }

        // DELETE: api/Flights/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOFlight>> DeleteFlight(int id, [FromQuery]int version)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdmin" && role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            var flight = await _context.Flights.Include(flight => flight.Seats).FirstOrDefaultAsync(flight => flight.FlightId == id);
            if (flight == null)
            {
                return NotFound();
            }

            bool success = false;
            if(flight.Version != version)
            {
                return Ok(new { success });
            }

            foreach(AirlineMicroservice.Models.Seat seat in flight.Seats)
            {
                var fastTicket = await _context.FastTickets.FindAsync(seat.SeatId);
                if(fastTicket != null)
                {
                    _context.FastTickets.Remove(fastTicket);
                }
            }

            AirlineMicroservice.TOModels.TOFlight toFlight = new AirlineMicroservice.TOModels.TOFlight(flight);

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            success = true;
            return Ok(new { success});
        }

        private bool FlightExists(int id)
        {
            return _context.Flights.Any(e => e.FlightId == id);
        }
    }
}
