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
using Newtonsoft.Json.Linq;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Careoplane.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public VehiclesController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TOVehicle>>> GetVehicles()
        {
            List<Vehicle> VehicleList = await _context.Vehicles.ToListAsync();
            List<TOVehicle> TOVehicleList = new List<TOVehicle>();
            VehicleList.ForEach(vehicle => TOVehicleList.Add(vehicle.ToTO()));

            return TOVehicleList;
        }

        [HttpGet]
        [Route("ForCompany")]
        public async Task<ActionResult<IEnumerable<int>>> GetVehiclesForCompany([FromQuery]string company)
        {
            List<Vehicle> VehicleList = await _context.Vehicles.Where(vehicle => vehicle.RentACar.Name == company).ToListAsync();
            List<int> ids = new List<int>();
            VehicleList.ForEach(vehicle => ids.Add(vehicle.VehicleId));

            return ids;
        }

        [HttpGet]
        [Route("Company")]
        public async Task<Object> GetCompanyForVehicle([FromQuery]string vehicleId)
        {
            var vehicle = await _context.Vehicles.Include(vehicle => vehicle.RentACar).Where(vehicle => vehicle.VehicleId == int.Parse(vehicleId)).FirstOrDefaultAsync();

            if (vehicle == null)
            {
                return NotFound();
            }

            string company = vehicle.RentACar.Name;

            return Ok(new { company });
        }

        [HttpGet]
        [Route("OnSale")]
        public async Task<ActionResult<IEnumerable<TOVehicle>>> GetVehiclesOnSale([FromQuery]string location, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            if (toDate == "" || toDate == null)
            {
                return new List<TOVehicle>();
            }

            List<Vehicle> vehicleList = await _context.Vehicles
                .Include(vehicle => vehicle.UnavailableDates)
                .Include(vehicle => vehicle.Ratings)
                .Include(vehicle => vehicle.RentACar)
                .Where(vehicle => vehicle.IsOnSale == true)
                .Where(vehicle => vehicle.Location == location)
                .ToListAsync();

            List<TOVehicle> returnList = new List<TOVehicle>();
            DateTime tempFromDate = DateTime.Parse(fromDate);
            DateTime tempToDate = DateTime.Parse(toDate);

            vehicleList.ForEach(vehicle =>
            {
               if (vehicle.UnavailableDates == null)
                {
                    returnList.Add(vehicle.ToTO());
                }
                else
                {
                    bool shouldAdd = true;
                    vehicle.UnavailableDates.ToList().ForEach(date =>
                    {
                        if (date.Date.Date >= tempFromDate.Date && date.Date.Date <= tempToDate.Date)
                        {
                            shouldAdd = false;
                        }
                    });

                    if (shouldAdd)
                    {
                        returnList.Add(vehicle.ToTO());
                    }
                }
            });

            return returnList;
        }

        [HttpPut("Rate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RateVehicle(JObject tempObject)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "regular")
            {
                return BadRequest("You are not authorised to do this action");
            }

            int vehicleId = tempObject["vehicleId"].ToObject<int>();
            int rating = tempObject["rating"].ToObject<int>();
            int reservationId = tempObject["reservationId"].ToObject<int>();

            var vehicle = await _context.Vehicles.Include(vehicle => vehicle.Ratings).FirstAsync(vehicle => vehicle.VehicleId == vehicleId);
            vehicle.Ratings.Add(new VehicleRating()
            {
                Vehicle = vehicle,
                VehicleRatingId = 0,
                VehicleRatingValue = rating
            });

            _context.Entry(vehicle).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var reservation = await _context.VehicleReservation
                .FirstOrDefaultAsync(reservation => reservation.ReservationId == reservationId);

            reservation.IsVehicleRated = true;

            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Vehicles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TOVehicle>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(vehicle => vehicle.UnavailableDates)
                .Include(vehicle => vehicle.Ratings)
                .Include(vehicle => vehicle.RentACar)
                .Where(vehicle => vehicle.VehicleId == id)
                .FirstOrDefaultAsync();

            if (vehicle == null)
            {
                return NotFound();
            }

            return vehicle.ToTO();
        }

        // PUT: api/Vehicles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutVehicle(int id, TOVehicle toVehicle)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "racAdmin" && role != "racAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            //Iscitaj vozilo i proveri verziju
            bool success = false;
            Vehicle vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle.Version != toVehicle.Version)
            {
                return Ok(new { success });
            }

            //Vehicle vehicle = new Vehicle();
            var rentACar = _context.RentACars.FirstOrDefault(r => r.Name == toVehicle.RentACar);
            vehicle.FromTO(toVehicle, rentACar);

            if (id != vehicle.VehicleId)
            {
                return BadRequest();
            }

            vehicle.Version++;
            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
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

        // POST: api/Vehicles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOVehicle>> PostVehicle(TOVehicle toVehicle)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "racAdmin" && role != "racAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            Vehicle vehicle = new Vehicle();
            var rentACar = _context.RentACars.FirstOrDefault(r => r.Name == toVehicle.RentACar);
            vehicle.FromTO(toVehicle, rentACar);
            vehicle.Version = 0;

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicle", new { id = vehicle.VehicleId }, vehicle);
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<TOVehicle>> DeleteVehicle(int id, [FromQuery]int version)
        {
            string role = User.Claims.First(c => c.Type == "Roles").Value;

            if (role != "racAdmin" && role != "racAdminNew")
            {
                return BadRequest("You are not authorised to do this action");
            }

            var vehicle = await _context.Vehicles
                .Include(v => v.RentACar)
                .Include(v => v.UnavailableDates)
                .FirstOrDefaultAsync(v => v.VehicleId == id);
            if (vehicle == null)
            {
                return NotFound();
            }

            bool success = false;
            if (vehicle.Version != version)
            {
                return Ok(new { success });
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            success = true;
            return Ok(new { success });
        }

        private bool VehicleExists(int id)
        {
            return _context.Vehicles.Any(e => e.VehicleId == id);
        }
    }
}
