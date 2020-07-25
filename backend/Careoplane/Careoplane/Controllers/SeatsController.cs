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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Careoplane.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SeatsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Seats/5
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOSeat>> GetSeat(int id)
        {
            var seat = await _context.Seats.Include(x=>x.Flight).FirstOrDefaultAsync(s => s.SeatId == id);

            if (seat == null)
            {
                return NotFound();
            }

            return new TOSeat(seat);
        }

        [HttpGet("Flight/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<Object> GetSeatForFlight(int id)
        {
            var seats = await _context.Seats.Where(seat => seat.Flight.FlightId == id).ToListAsync();

            if (seats == null)
            {
                return NotFound();
            }

            var notFound = true;

            foreach(Seat seat in seats)
            {
                if (seat.Occupied)
                {
                    notFound = false;
                }
            }

            return Ok(new { notFound });
        }

        // PUT: api/Seats/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutSeat(int id, TOSeat seat, [FromQuery]int version)
        {
            if (id != seat.SeatId)
            {
                return BadRequest();
            }

            Flight tempFlight = await _context.Flights.FindAsync(seat.FlightId);
            var success = false;
            if(tempFlight.Version != version)
            {
                return Ok(new { success });
            }
            tempFlight.Version++;
            _context.Entry(tempFlight).State = EntityState.Modified;

            Seat oldSeat = await _context.Seats
                .Include(s => s.Flight).ThenInclude(f => f.Airline)
                .FirstOrDefaultAsync(s => s.SeatId == seat.SeatId);

            Seat tempSeat = new Seat(seat, _context);

            if(oldSeat.Discount == 0 && tempSeat.Discount != 0)
            {
                FastTicket fastTicket = new FastTicket()
                {
                    SeatId = tempSeat.SeatId,
                    Airline = tempSeat.Flight.Airline,
                    NewPrice = Math.Round(tempSeat.Price * (1 - (0.01 * tempSeat.Discount)))
                };
                _context.Add(fastTicket);
            }
            else if(seat.Discount == 0 && oldSeat.Discount != 0)
            {
                FastTicket fastTicket = await _context.FastTickets.FindAsync(tempSeat.SeatId);
                _context.Remove(fastTicket);
            }
            else if(seat.Discount != oldSeat.Discount)
            {
                FastTicket oldFastTicket = await _context.FastTickets.FindAsync(tempSeat.SeatId);
                FastTicket fastTicket = new FastTicket()
                {
                    Airline = oldFastTicket.Airline,
                    SeatId = oldFastTicket.SeatId,
                    NewPrice = Math.Round(tempSeat.Price * (1 - (0.01 * tempSeat.Discount)))
                };
                _context.Entry(oldFastTicket).CurrentValues.SetValues(fastTicket);
            }

            _context.Entry(oldSeat).CurrentValues.SetValues(tempSeat);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(id))
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

        private bool SeatExists(int id)
        {
            return _context.Seats.Any(e => e.SeatId == id);
        }
    }
}
