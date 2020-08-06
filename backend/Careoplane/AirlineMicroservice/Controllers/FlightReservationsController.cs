using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AirlineMicroservice.Database;
using AirlineMicroservice.Models;
using AirlineMicroservice.TOModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Common.Services;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.FileProviders;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Net.Http;

namespace AirlineMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightReservationsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        public FlightReservationsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/FlightReservations
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<TOFlightReservation>>> GetFlightReservations()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            string username = User.Claims.First(c => c.Type == "Username").Value;
            //var user = await _userManager.FindByIdAsync(userId);

            var reservations = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails).ThenInclude(details => details.PassengerSeats).ToListAsync();

            List<PassengerSeat> passengerSeatsToRemove = new List<PassengerSeat>();
            List<FlightReservationDetail> DetailsToRemove = new List<FlightReservationDetail>();
            List<FlightReservation> reservationsToRemove = new List<FlightReservation>();


            Dictionary<int, TOFlightReservation> varResult = new Dictionary<int, TOFlightReservation>();

            bool invitationExpired = false;
            bool cancelationExpired = false;

            for (int i = 0; i < reservations.Count(); i++)
            {
                invitationExpired = false;
                cancelationExpired = false;

                if (reservations[i].TimeOfCreation.AddDays(3) < DateTime.Now)
                {
                    invitationExpired = true;
                }
                Flight flight = await _context.Flights.FindAsync(reservations[i].FlightReservationDetails[0].FlightId);
                if (flight.Departure < DateTime.Now.AddHours(3))
                {
                    cancelationExpired = true;
                }

                for (int j = 0; j < reservations[i].FlightReservationDetails.Count(); j++)
                {
                    for (int k = 0; k < reservations[i].FlightReservationDetails[j].PassengerSeats.Count(); k++)
                    {
                        if (reservations[i].FlightReservationDetails[j].PassengerSeats[k].Accepted == false)
                        {
                            if (invitationExpired || cancelationExpired)
                            {
                                Seat seat = await _context.Seats.FindAsync(reservations[i].FlightReservationDetails[j].PassengerSeats[k].SeatId);
                                seat.Occupied = false;

                                _context.Entry(seat).State = EntityState.Modified;

                                await _context.SaveChangesAsync();
                                passengerSeatsToRemove.Add(reservations[i].FlightReservationDetails[j].PassengerSeats[k]);
                            }
                        }
                    }

                    foreach (PassengerSeat passengerSeat in passengerSeatsToRemove)
                    {
                        _context.Entry(passengerSeat).State = EntityState.Deleted;
                    }

                    foreach (PassengerSeat passenger in passengerSeatsToRemove)
                    {
                        reservations[i].FlightReservationDetails[j].PassengerSeats.Remove(passenger);
                    }

                    if (reservations[i].FlightReservationDetails[j].PassengerSeats.Count() == 0)
                    {
                        DetailsToRemove.Add(reservations[i].FlightReservationDetails[j]);
                    }
                }

                foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
                {
                    _context.Entry(flightReservationDetail).State = EntityState.Deleted;
                }

                foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
                {
                    reservations[i].FlightReservationDetails.Remove(flightReservationDetail);
                }

                if (reservations[i].FlightReservationDetails.Count() == 0)
                {
                    reservationsToRemove.Add(reservations[i]);
                }
            }

            foreach (FlightReservation reservation in reservationsToRemove)
            {
                if (reservation.VehicleReservationId != 0)
                {
                    await deleteVehicleReservation(reservation.VehicleReservationId).ConfigureAwait(false);
                }
                _context.Entry(reservation).State = EntityState.Deleted;
            }

            foreach (FlightReservation reservation in reservationsToRemove)
            {
                reservations.Remove(reservation);
            }

            await _context.SaveChangesAsync();

            foreach (var reservation in reservations)
            {
                _context.Entry(reservation).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {

                }
            }

            foreach (FlightReservation flightReservation in reservations)
            {
                if(flightReservation.Creator == username)
                {
                    varResult.TryAdd(flightReservation.ReservationId, new TOFlightReservation(flightReservation, _context));
                }
                foreach (FlightReservationDetail flightReservationDetail in flightReservation.FlightReservationDetails)
                {
                    foreach(PassengerSeat passengerSeat in flightReservationDetail.PassengerSeats)
                    {
                        if (passengerSeat.Username == username)
                        {
                            varResult.TryAdd(flightReservation.ReservationId, new TOFlightReservation(flightReservation, _context));
                        }
                    }
                }
            }


            return varResult.Values.ToList();
        }

        [HttpGet("Company/{company}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<TOFlightReservation>>> GetCompanyFlightReservations(string company)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "aeroAdmin" && role != "aeroAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            var reservations = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails).ThenInclude(details => details.PassengerSeats).ToListAsync();

            List<PassengerSeat> passengerSeatsToRemove = new List<PassengerSeat>();
            List<FlightReservationDetail> DetailsToRemove = new List<FlightReservationDetail>();
            List<FlightReservation> reservationsToRemove = new List<FlightReservation>();


            Dictionary<int, TOFlightReservation> varResult = new Dictionary<int, TOFlightReservation>();

            bool invitationExpired = false;
            bool cancelationExpired = false;

            for (int i = 0; i < reservations.Count(); i++)
            {
                invitationExpired = false;
                cancelationExpired = false;

                if (reservations[i].TimeOfCreation.AddDays(3) < DateTime.Now)
                {
                    invitationExpired = true;
                }
                Flight flight = await _context.Flights.FindAsync(reservations[i].FlightReservationDetails[0].FlightId);
                if (flight.Departure < DateTime.Now.AddHours(3))
                {
                    cancelationExpired = true;
                }

                for (int j = 0; j < reservations[i].FlightReservationDetails.Count(); j++)
                {
                    for (int k = 0; k < reservations[i].FlightReservationDetails[j].PassengerSeats.Count(); k++)
                    {
                        if (reservations[i].FlightReservationDetails[j].PassengerSeats[k].Accepted == false)
                        {
                            if (invitationExpired || cancelationExpired)
                            {
                                Seat seat = await _context.Seats.FindAsync(reservations[i].FlightReservationDetails[j].PassengerSeats[k].SeatId);
                                seat.Occupied = false;

                                _context.Entry(seat).State = EntityState.Modified;

                                await _context.SaveChangesAsync();
                                passengerSeatsToRemove.Add(reservations[i].FlightReservationDetails[j].PassengerSeats[k]);
                            }
                        }
                    }

                    foreach (PassengerSeat passengerSeat in passengerSeatsToRemove)
                    {
                        _context.Entry(passengerSeat).State = EntityState.Deleted;
                    }

                    foreach (PassengerSeat passenger in passengerSeatsToRemove)
                    {
                        reservations[i].FlightReservationDetails[j].PassengerSeats.Remove(passenger);
                    }

                    if (reservations[i].FlightReservationDetails[j].PassengerSeats.Count() == 0)
                    {
                        DetailsToRemove.Add(reservations[i].FlightReservationDetails[j]);
                    }
                }

                foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
                {
                    _context.Entry(flightReservationDetail).State = EntityState.Deleted;
                }

                foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
                {
                    reservations[i].FlightReservationDetails.Remove(flightReservationDetail);
                }

                if (reservations[i].FlightReservationDetails.Count() == 0)
                {
                    reservationsToRemove.Add(reservations[i]);
                }
            }

            foreach (FlightReservation reservation in reservationsToRemove)
            {
                if (reservation.VehicleReservationId != 0)
                {
                    await deleteVehicleReservation(reservation.VehicleReservationId).ConfigureAwait(false);
                }
                _context.Entry(reservation).State = EntityState.Deleted;
            }

            foreach (FlightReservation reservation in reservationsToRemove)
            {
                reservations.Remove(reservation);
            }

            await _context.SaveChangesAsync();

            foreach (var reservation in reservations)
            {
                _context.Entry(reservation).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {

                }
            }

            foreach(FlightReservation flightReservation in reservations)
            {
                foreach(FlightReservationDetail flightReservationDetail in flightReservation.FlightReservationDetails)
                {
                    if(flightReservationDetail.AirlineName == company)
                    {
                        varResult.TryAdd(flightReservation.ReservationId, new TOFlightReservation(flightReservation, _context));
                    }
                }
            }

            return varResult.Values.ToList();
        }

        // GET: api/FlightReservations/5
        [HttpGet("Single")]
        public async Task<ActionResult<TOFlightReservation>> GetFlightReservation([FromQuery]int id, [FromQuery]string username)
        {
            FlightReservation flightReservation = await _context.FlightReservations
                .Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats)
                .FirstOrDefaultAsync(reservation => reservation.ReservationId == id);

            List<PassengerSeat> passengerSeatsToRemove = new List<PassengerSeat>();
            List<FlightReservationDetail> DetailsToRemove = new List<FlightReservationDetail>();

            bool invitationExpired = false;
            bool cancelationExpired = false;

            if (flightReservation.TimeOfCreation.AddDays(3) < DateTime.Now)
            {
                invitationExpired = true;
            }
            Flight flight = await _context.Flights.FindAsync(flightReservation.FlightReservationDetails[0].FlightId);
            if (flight.Departure < DateTime.Now.AddHours(3))
            {
                cancelationExpired = true;
            }

            for (int i = 0; i < flightReservation.FlightReservationDetails.Count(); i++)
            {
                for (int j = 0; j < flightReservation.FlightReservationDetails[i].PassengerSeats.Count(); j++)
                {
                    if (!flightReservation.FlightReservationDetails[i].PassengerSeats[j].Accepted)
                    {
                        if (invitationExpired || cancelationExpired)
                        {
                            Seat seat = await _context.Seats.FindAsync(flightReservation.FlightReservationDetails[i].PassengerSeats[j].SeatId);
                            seat.Occupied = false;

                            _context.Entry(seat).State = EntityState.Modified;

                            await _context.SaveChangesAsync();
                            passengerSeatsToRemove.Add(flightReservation.FlightReservationDetails[i].PassengerSeats[j]);
                        }
                    }
                }

                foreach (PassengerSeat passengerSeat in passengerSeatsToRemove)
                {
                    _context.Entry(passengerSeat).State = EntityState.Deleted;
                }

                foreach (PassengerSeat passenger in passengerSeatsToRemove)
                {
                    flightReservation.FlightReservationDetails[i].PassengerSeats.Remove(passenger);
                }

                if (flightReservation.FlightReservationDetails[i].PassengerSeats.Count() == 0)
                {
                    DetailsToRemove.Add(flightReservation.FlightReservationDetails[i]);
                    
                }

            }

            foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
            {
                _context.Entry(flightReservationDetail).State = EntityState.Deleted;
            }

            foreach (FlightReservationDetail flightReservationDetail in DetailsToRemove)
            {
                flightReservation.FlightReservationDetails.Remove(flightReservationDetail);
            }

            if (flightReservation.FlightReservationDetails.Count() == 0)
            {
                if (flightReservation.VehicleReservationId != 0)
                {
                    await deleteVehicleReservation(flightReservation.VehicleReservationId).ConfigureAwait(false);
                }

                _context.FlightReservations.Remove(flightReservation);
                await _context.SaveChangesAsync();

                return NotFound();
            }
            else
            {
                _context.Entry(flightReservation).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            

            var found = false;
            
            if(flightReservation.Creator == username)
            {
                found = true;
            }

            for(int i = 0; i < flightReservation.FlightReservationDetails[0].PassengerSeats.Count(); i++)
            {
                if(flightReservation.FlightReservationDetails[0].PassengerSeats[i].Username == username)
                {
                    found = true;
                }
            }

            if (!found)
                flightReservation = null;

            if (flightReservation == null)
            {
                return NotFound();
            }

            return new TOFlightReservation(flightReservation, _context);
        }

        // PUT: api/FlightReservations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFlightReservation(int id, JObject username)
        {
            var tempUsername = username["username"].ToString();

            var tempFlightReservation = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats).FirstOrDefaultAsync(reservation => reservation.ReservationId == id);

            for(int i = 0; i < tempFlightReservation.FlightReservationDetails.Count; i++)
            {
                for(int j = 0; j < tempFlightReservation.FlightReservationDetails[i].PassengerSeats.Count; j++)
                {
                    if(tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j].Username == tempUsername)
                    {
                        tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j].Accepted = true;
                        _context.Entry(tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j]).State = EntityState.Modified;
                    }
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightReservationExists(id))
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

        [HttpPut("Cancel/{id}")]
        public async Task<IActionResult> CancelFlightReservation(int id, JObject username)
        {
            var tempUsername = username["username"].ToString();

            var tempFlightReservation = await _context.FlightReservations.Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats).FirstOrDefaultAsync(reservation => reservation.ReservationId == id);

            for (int i = 0; i < tempFlightReservation.FlightReservationDetails.Count; i++)
            {
                for (int j = 0; j < tempFlightReservation.FlightReservationDetails[i].PassengerSeats.Count; j++)
                {
                    if (tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j].Username == tempUsername)
                    {
                        Seat seat = await _context.Seats.FindAsync(tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j].SeatId);
                        seat.Occupied = false;

                        _context.Entry(seat).State = EntityState.Modified;

                        if(seat.Discount != 0)
                        {
                            FastTicket fastTicket = new FastTicket()
                            {
                                SeatId = seat.SeatId,
                                Airline = _context.Airlines.Find(tempFlightReservation.FlightReservationDetails[i].AirlineName),
                                NewPrice = seat.Price * (1 - (0.01 * seat.Discount))
                            };

                            _context.FastTickets.Add(fastTicket);
                        }

                        await _context.SaveChangesAsync();

                        tempFlightReservation.FlightReservationDetails[i].PassengerSeats.Remove(tempFlightReservation.FlightReservationDetails[i].PassengerSeats[j]);
                        break;
                    }
                }
            }

            if(tempFlightReservation.FlightReservationDetails[0].PassengerSeats.Count() != 0)
                _context.Entry(tempFlightReservation).State = EntityState.Modified;
            else
            {
                if(tempFlightReservation.VehicleReservationId != 0)
                {
                    await deleteVehicleReservation(tempFlightReservation.VehicleReservationId).ConfigureAwait(false);
                }
                _context.Entry(tempFlightReservation).State = EntityState.Deleted;

            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightReservationExists(id))
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

        async Task deleteVehicleReservation(int id)
        {
            using (HttpClient client = new HttpClient())
            {
                var httpRequest = new HttpRequestMessage(HttpMethod.Delete, "http://rentacarmicroservice/VehicleReservations/" + id.ToString());
                await client.SendAsync(httpRequest);
            }

        }

        // POST: api/FlightReservations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[HttpPost("{points}")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //public async Task<ActionResult<FlightReservation>> PostFlightReservation(TOFlightReservation flightReservation, int points)
        //{
        //    TOFlight tempFlight = new TOFlight();

        //    string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //    string username = User.Claims.First(c => c.Type == "Username").Value;
        //    //var inviter = await _userManager.FindByIdAsync(userId);

        //    Common.Models.VehicleReservation vehicleReservation = null;
        //    Common.Models.Vehicle vehicle = null;

        //    if (flightReservation.VehicleReservationId != 0)
        //    {
        //        vehicleReservation = await _rentACarContext.VehicleReservation.FindAsync(flightReservation.VehicleReservationId);
        //        vehicle = await _rentACarContext.Vehicles.Include(vehicle => vehicle.RentACar).FirstOrDefaultAsync(vehicle => vehicle.VehicleId == vehicleReservation.VehicleId);
        //    }

        //    FlightReservation tempFlightReservation = new FlightReservation()
        //    {
        //        ReservationId = 0,
        //        TimeOfCreation = DateTime.Now,
        //        Creator = username,
        //        VehicleReservationId = flightReservation.VehicleReservationId,
        //        FinalPrice = flightReservation.FinalPrice
        //    };

        //    flightReservation.FlightReservationDetails.ForEach(flightReservation => { inviter.NumberOfPoint += (int)Math.Round(flightReservation.Flight.Distance); });
        //    inviter.NumberOfPoint -= points;

        //    await _userManager.UpdateAsync(inviter);

        //    _context.FlightReservations.Add(tempFlightReservation);
        //    await _context.SaveChangesAsync();

        //    foreach (TOFlightReservationDetail tOFlightReservationDetail in flightReservation.FlightReservationDetails)
        //    {
        //        tempFlight = tOFlightReservationDetail.Flight;

        //        FlightReservationDetail flightReservationDetail = new FlightReservationDetail()
        //        {
        //            FlightId = tOFlightReservationDetail.Flight.FlightId,
        //            FlightReservation = tempFlightReservation,
        //            FlightReservationDetailId = 0,
        //            AirlineName = tOFlightReservationDetail.Flight.AirlineName
        //        };

        //        _context.Entry(flightReservationDetail).State = EntityState.Added;

        //        await _context.SaveChangesAsync();

        //        foreach (TOPassengerSeat tOPassengerSeat in tOFlightReservationDetail.PassengerSeats)
        //        {
        //            PassengerSeat passengerSeat = new PassengerSeat()
        //            {
        //                SeatId = tOPassengerSeat.Seat.SeatId,
        //                Surname = tOPassengerSeat.Surname,
        //                PassengerSeatId = 0,
        //                Name = tOPassengerSeat.Name,
        //                Passport = tOPassengerSeat.Passport,
        //                Username = tOPassengerSeat.Username,
        //                FlightReservationDetail = flightReservationDetail,
        //                AirlineScored = false,
        //                FlightScored = false,
        //            };

        //            if (passengerSeat.Username == "" || passengerSeat.Username == inviter.UserName)
        //            {
        //                passengerSeat.Accepted = true;
        //            }
        //            else
        //            {
        //                passengerSeat.Accepted = false;
        //            }

        //            _context.Entry(passengerSeat).State = EntityState.Added;

        //            if(passengerSeat.Username != null && passengerSeat.Username != "" && passengerSeat.Username != inviter.UserName)
        //            {
        //                var user = await _userManager.FindByNameAsync(passengerSeat.Username);

        //                flightReservation.FlightReservationDetails.ForEach(flightReservation => { user.NumberOfPoint += (int)Math.Round(flightReservation.Flight.Distance); });

        //                await _userManager.UpdateAsync(user);

        //                //MailingService.SendEMailInvite(inviter, user, flightReservation, vehicle, tempFlightReservation.ReservationId);
        //            }

        //            Seat seat = await _context.Seats.FindAsync(passengerSeat.SeatId);
        //            seat.Occupied = true;
        //            _context.Entry(seat).State = EntityState.Modified;
        //            await _context.SaveChangesAsync();
        //        }

        //        await _context.SaveChangesAsync();
        //    }

        //    //MailingService.SendEMailReceipt(inviter, flightReservation, vehicle);

        //    return Ok();
        //}

        // DELETE: api/FlightReservations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FlightReservation>> DeleteFlightReservation(int id)
        {
            var flightReservation = await _context.FlightReservations
                .Include(reservation => reservation.FlightReservationDetails)
                .ThenInclude(details => details.PassengerSeats)
                .FirstAsync(reservation => reservation.ReservationId == id);
            if (flightReservation == null)
            {
                return NotFound();
            }

            if(flightReservation.VehicleReservationId != 0)
            {
                await deleteVehicleReservation(flightReservation.VehicleReservationId).ConfigureAwait(false);
            }

            foreach(FlightReservationDetail flightReservationDetail in flightReservation.FlightReservationDetails)
            {
                foreach(PassengerSeat passengerSeat in flightReservationDetail.PassengerSeats)
                {
                    Seat seat = await _context.Seats.FindAsync(passengerSeat.SeatId);
                    seat.Occupied = false;
                    _context.Entry(seat).State = EntityState.Modified;
                }
            }

            _context.FlightReservations.Remove(flightReservation);
            await _context.SaveChangesAsync();

            return flightReservation;
        }

        private bool FlightReservationExists(int id)
        {
            return _context.FlightReservations.Any(e => e.ReservationId == id);
        }
    }
}
