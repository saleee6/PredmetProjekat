using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentACarMicroservice.Database;
using Common.Models;
using Common.TOModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace RentACarMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleReservationsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public VehicleReservationsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/VehicleReservations
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<TOVehicleReservation>>> GetVehicleReservation()
        {
            List<VehicleReservation> VehicleReservationList = await _context.VehicleReservation.ToListAsync();
            List<TOVehicleReservation> TOVehicleReservationList = new List<TOVehicleReservation>();
            VehicleReservationList.ForEach(reservation => TOVehicleReservationList.Add(reservation.ToTO()));

            return TOVehicleReservationList;
        }

        [HttpGet]
        [Route("ForVehicles")]
        public async Task<ActionResult<IEnumerable<TOVehicleReservation>>> GetVehicleReservationsForVehicles([FromQuery]string vehicleIds)
        {
            List<int> ids = new List<int>();
            string[] stringIds = vehicleIds.Split(',');
            List<VehicleReservation> VehicleReservationList = new List<VehicleReservation>();

            for (int i = 0; i < stringIds.Count() - 1; i++)
            {
                var tempList = await _context.VehicleReservation
                    .Where(vehicleReservation => vehicleReservation.VehicleId == int.Parse(stringIds[i]))
                    .ToListAsync();
                VehicleReservationList.AddRange(tempList);
            }

            List<TOVehicleReservation> TOVehicleReservationList = new List<TOVehicleReservation>();
            VehicleReservationList.ForEach(reservation => TOVehicleReservationList.Add(reservation.ToTO()));

            return TOVehicleReservationList;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Route("ForUser")]
        public async Task<ActionResult<IEnumerable<TOVehicleReservation>>> GetVehicleReservationsForUser()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            string role = User.Claims.First(c => c.Type == "Roles").Value;
            string username = User.Claims.First(c => c.Type == "Username").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            //var user = await _userManager.FindByIdAsync(userId);

            if (username != null && username != "")
            {
                List<VehicleReservation> VehicleReservationList = new List<VehicleReservation>();

                VehicleReservationList = await _context.VehicleReservation
                    .Where(vehicleReservation => vehicleReservation.UserName == username)
                    .Where(vehicleReservation => vehicleReservation.Type == "vehicle")
                    .ToListAsync();

                List<TOVehicleReservation> TOVehicleReservationList = new List<TOVehicleReservation>();
                VehicleReservationList.ForEach(reservation => TOVehicleReservationList.Add(reservation.ToTO()));

                return TOVehicleReservationList;
            } else
            {
                return BadRequest();
            }
        }


        // GET: api/VehicleReservations/5
        [HttpGet("{id}")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOVehicleReservation>> GetVehicleReservation(int id)
        {
            //string role = User.Claims.First(c => c.Type == "Roles").Value;

            //if (role != "regular")
            //{
            //    return BadRequest("You are not authorised to do this action");
            //}

            var vehicleReservation = await _context.VehicleReservation.FindAsync(id);

            if (vehicleReservation == null)
            {
                return NotFound();
            }

            return vehicleReservation.ToTO();
        }

        // PUT: api/VehicleReservations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutVehicleReservation(int id, TOVehicleReservation toVehicleReservation)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            VehicleReservation vehicleReservation = new VehicleReservation();
            vehicleReservation.FromTO(toVehicleReservation);

            if (id != vehicleReservation.ReservationId)
            {
                return BadRequest();
            }

            _context.Entry(vehicleReservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleReservationExists(id))
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

        // POST: api/VehicleReservations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<Object> PostVehicleReservation(TOVehicleReservation toVehicleReservation, [FromQuery]int version)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            VehicleReservation vehicleReservation = new VehicleReservation();
            vehicleReservation.FromTO(toVehicleReservation);

            bool success = false;
            Vehicle vehicle = await _context.Vehicles.Include(v => v.UnavailableDates).FirstOrDefaultAsync(v => v.VehicleId == vehicleReservation.VehicleId);
            if (vehicle.Version != version)
            {
                //Provera da li je zbog edita ili rezervacije duple
                return Ok(new { success });
            }

            _context.VehicleReservation.Add(vehicleReservation);
            await _context.SaveChangesAsync();

            //Treba popuniti Unavailable Dates
            

            for (int i = 0; i < vehicleReservation.NumOfDays; i++)
            {
                vehicle.UnavailableDates.Add(new UnavailableDate()
                {
                    DateId = 0,
                    Vehicle = vehicle,
                    Date = vehicleReservation.FromDate.AddDays(i)
                });
            }

            vehicle.Version++;
            await _context.SaveChangesAsync();

            int id = vehicleReservation.ReservationId;
            success = true;
            return Ok(new { id, success });
        }

        // DELETE: api/VehicleReservations/5
        [HttpDelete("{id}")] //Izmeniti odgovor
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOVehicleReservation>> DeleteVehicleReservation(int id)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            var vehicleReservation = await _context.VehicleReservation.FindAsync(id);
            if (vehicleReservation == null)
            {
                return NotFound();
            }

            _context.VehicleReservation.Remove(vehicleReservation);
            await _context.SaveChangesAsync();

            var vehicle = await _context.Vehicles.Include(vehicle => vehicle.UnavailableDates).FirstOrDefaultAsync(vehicle => vehicle.VehicleId == vehicleReservation.VehicleId);

            vehicle.UnavailableDates.ToList().ForEach(
                unavailableDate =>
                {
                    if (unavailableDate.Date.Date >= vehicleReservation.FromDate.Date && unavailableDate.Date.Date <= vehicleReservation.ToDate.Date)
                    {
                        _context.Remove(unavailableDate);
                    }
                }
            );

            await _context.SaveChangesAsync();

            return vehicleReservation.ToTO();
        }

        private bool VehicleReservationExists(int id)
        {
            return _context.VehicleReservation.Any(e => e.ReservationId == id);
        }

        [HttpGet("Vehicle/{id}")]
        public async Task<Object> GetVehicleForReservation(int id)
        {
            var vehicleReservation = await _context.VehicleReservation.FindAsync(id);

            if (vehicleReservation == null)
            {
                return NotFound();
            }

            var vehicle = await _context.Vehicles
                .Include(vehicle => vehicle.RentACar)
                .Where(vehicle => vehicle.VehicleId == vehicleReservation.VehicleId)
                .FirstOrDefaultAsync();

            if (vehicle == null)
            {
                return NotFound();
            }

            VehicleForEmail vehicleForEmail = new VehicleForEmail()
            {
                Brand = vehicle.Brand,
                RentACarName = vehicle.RentACar.Name
            };

            return System.Text.Json.JsonSerializer.Serialize(vehicleForEmail);
        }

        [HttpDelete("Airline/{id}")]
        public async Task<ActionResult<TOVehicleReservation>> DeleteVehicleReservationCombined(int id)
        {
            var vehicleReservation = await _context.VehicleReservation.FindAsync(id);
            if (vehicleReservation == null)
            {
                return NotFound();
            }

            _context.VehicleReservation.Remove(vehicleReservation);
            await _context.SaveChangesAsync();

            var vehicle = await _context.Vehicles.Include(vehicle => vehicle.UnavailableDates).FirstOrDefaultAsync(vehicle => vehicle.VehicleId == vehicleReservation.VehicleId);

            vehicle.UnavailableDates.ToList().ForEach(
                unavailableDate =>
                {
                    if (unavailableDate.Date.Date >= vehicleReservation.FromDate.Date && unavailableDate.Date.Date <= vehicleReservation.ToDate.Date)
                    {
                        _context.Remove(unavailableDate);
                    }
                }
            );

            await _context.SaveChangesAsync();

            return vehicleReservation.ToTO();
        }
    }
}
