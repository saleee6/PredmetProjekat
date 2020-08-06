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
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace AirlineMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FastTicketsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public FastTicketsController(DatabaseContext context)
        {
            _context = context;
        }

        // PUT: api/FastTickets/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutFastTicket(int id, [FromBody] JObject Obj, [FromQuery] int version)
        {
            AirlineMicroservice.TOModels.TOFastTicket fastTicket = Obj["fastTicket"].ToObject<AirlineMicroservice.TOModels.TOFastTicket>();
            bool occupied = Obj["occupied"].ToObject<bool>();

            if (id != fastTicket.Seat.SeatId)
            {
                return BadRequest();
            }

            AirlineMicroservice.Models.Flight tempFlight = await _context.Flights.FindAsync(fastTicket.Seat.FlightId);

            var success = false;
            if(tempFlight.Version != version)
            {
                return Ok(new { success });
            }
            tempFlight.Version++;
            _context.Entry(tempFlight).State = EntityState.Modified;

            AirlineMicroservice.Models.FastTicket tempFastTicket = await _context.FastTickets.FindAsync(fastTicket.Seat.SeatId);

            AirlineMicroservice.Models.Seat seat = await _context.Seats.Include(seat => seat.Flight).ThenInclude(flight => flight.Airline).FirstAsync(seat => seat.SeatId == fastTicket.Seat.SeatId);
            seat.Occupied = occupied;

            _context.Entry(seat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                string username = User.Claims.First(c => c.Type == "Username").Value;
                //var user = await _userManager.FindByIdAsync(userId);

                if (occupied == true)
                {
                    AirlineMicroservice.Models.FlightReservation flightReservation = new AirlineMicroservice.Models.FlightReservation()
                    {
                        ReservationId = 0,
                        Creator = username,
                        FinalPrice = fastTicket.NewPrice,
                        TimeOfCreation = DateTime.Now,
                        VehicleReservationId = 0
                    };

                    AirlineMicroservice.Models.FlightReservationDetail flightReservationDetail = new AirlineMicroservice.Models.FlightReservationDetail()
                    {
                        FlightReservation = flightReservation,
                        AirlineName = seat.Flight.Airline.Name,
                        FlightReservationDetailId = 0,
                        FlightId = seat.Flight.FlightId
                    };

                    AirlineMicroservice.Models.PassengerSeat passengerSeat = new AirlineMicroservice.Models.PassengerSeat()
                    {
                        PassengerSeatId = 0,
                        FlightReservationDetail = flightReservationDetail,
                        SeatId = seat.SeatId,
                        Username = username,
                        Accepted = true,
                        AirlineScored = false,
                        FlightScored = false ,
                        Name = "",
                        Surname = "",
                        Passport = ""
                    };

                    flightReservationDetail.PassengerSeats = new List<AirlineMicroservice.Models.PassengerSeat>();
                    flightReservationDetail.PassengerSeats.Add(passengerSeat);

                    flightReservation.FlightReservationDetails = new List<AirlineMicroservice.Models.FlightReservationDetail>();
                    flightReservation.FlightReservationDetails.Add(flightReservationDetail);

                    _context.FlightReservations.Add(flightReservation);
                    _context.FastTickets.Remove(tempFastTicket);
                    await _context.SaveChangesAsync();
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FastTicketExists(id))
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

        // DELETE: api/FastTickets/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<AirlineMicroservice.Models.FastTicket>> DeleteFastTicket(int id)
        {
            var fastTicket = await _context.FastTickets.FindAsync(id);
            if (fastTicket == null)
            {
                return NotFound();
            }

            AirlineMicroservice.Models.Seat seat = await _context.Seats.Include(seat => seat.Flight).ThenInclude(flight => flight.Airline).FirstAsync(seat => seat.SeatId == fastTicket.SeatId);
            seat.Occupied = false;
            seat.Discount = 0;

            _context.Entry(seat).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _context.FastTickets.Remove(fastTicket);
            await _context.SaveChangesAsync();

            return fastTicket;
        }

        private bool FastTicketExists(int id)
        {
            return _context.FastTickets.Any(e => e.SeatId == id);
        }
    }
}
