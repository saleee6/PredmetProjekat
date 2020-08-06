using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AirlineMicroservice.Database;
using Common.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Careoplane.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly DatabaseContext _context;
        public UploadController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpPost, DisableRequestSizeLimit]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<Object> Upload()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            string role = User.Claims.First(c => c.Type == "Roles").Value;
            string username = User.Claims.First(c => c.Type == "Username").Value;
            //var user = await _userManager.FindByIdAsync(userId);

            if (role != "aeroAdminNew" && role != "aeroAdmin")
            {
                return BadRequest();
            }

            try
            {
                string company = User.Claims.First(c => c.Type == "Company").Value;
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("StaticFiles", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    AirlineMicroservice.Models.Airline airline = await _context.Airlines.FindAsync(company);
                    airline.Image = dbPath;

                    _context.Entry(airline).State = EntityState.Modified;

                    await _context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
