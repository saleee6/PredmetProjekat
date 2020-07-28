using Common.TOModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web;
using Common.Models;

namespace Common.Services
{
    public static class MailingService
    {
        //public static void SendEMailInvite(AppUser inviter, AppUser user, TOFlightReservation flightReservation, Vehicle vehicle, int id)
        //{
        //    MailAddress to = new MailAddress(user.Email, user.Name);
        //    MailAddress from = new MailAddress("careoplane@gmail.com", "Careoplane");

        //    MailMessage message = new MailMessage(from, to);
        //    message.Subject = "Careoplane - Invitation";

        //    var link = string.Format("http://localhost:4200/main/flight-reservation-details?username={0}&id={1}", user.UserName, id);

        //    string text = string.Format("Hello {0},\n\n\tUser {1} {2}, has invited you to travel with him/her. Below are flight details:\n\t", user.Name, inviter.Name, inviter.Surname);
        //    foreach (TOFlightReservationDetail tOFlightReservationDetail in flightReservation.FlightReservationDetails)
        //    {
        //        text += string.Format("\tFlight ({4}): from {0} ({1}) to {2} ({3})\n\t", tOFlightReservationDetail.Flight.Origin, tOFlightReservationDetail.Flight.Departure.ToString(), tOFlightReservationDetail.Flight.Destination, tOFlightReservationDetail.Flight.Arrival.ToString(), tOFlightReservationDetail.Flight.AirlineName);
        //    }

        //    if (vehicle != null)
        //    {
        //        text += string.Format("\tVehicle ({1}): {0}\n", vehicle.Brand, vehicle.RentACar.Name);
        //    }

        //    text += string.Format("\nIf you would like to accept or decline this invitaion, please follow this link {0}\n\n\t", link);
        //    text += "Hope you have an enjoyable trip.\n\tAll the best,\n\tCareoplane";

        //    message.Body = text;

        //    SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
        //    {
        //        Credentials = new NetworkCredential("careoplane@gmail.com", "Careoplane11-9"),
        //        EnableSsl = true
        //    };

        //    try
        //    {
        //        client.Send(message);
        //    }
        //    catch (SmtpException ex)
        //    {
        //        Console.WriteLine(ex.ToString());
        //        throw ex;
        //    }
        //}

        //public static void SendEMailReceipt(AppUser user, TOFlightReservation flightReservation, Vehicle vehicle)
        //{
        //    MailAddress to = new MailAddress(user.Email, user.Name);
        //    MailAddress from = new MailAddress("careoplane@gmail.com", "Careoplane");

        //    MailMessage message = new MailMessage(from, to);
        //    message.Subject = "Careoplane - Receipt";

        //    string text = string.Format("Hello {0},\n\n\tRecently you have made a reservation on our website. Below are your reservation details:\n\t", user.Name);
        //    foreach (TOFlightReservationDetail tOFlightReservationDetail in flightReservation.FlightReservationDetails)
        //    {
        //        text += string.Format("\tFlight ({4}): from {0} ({1}) to {2} ({3})\n\t", tOFlightReservationDetail.Flight.Origin, tOFlightReservationDetail.Flight.Departure.ToString(), tOFlightReservationDetail.Flight.Destination, tOFlightReservationDetail.Flight.Arrival.ToString(), tOFlightReservationDetail.Flight.AirlineName);
        //    }

        //    if (vehicle != null)
        //    {
        //        text += string.Format("\tVehicle ({1}): {0}\n\n", vehicle.Brand, vehicle.RentACar.Name);
        //    }

        //    text += string.Format("Final price: €{0}\n\n\t", flightReservation.FinalPrice);
        //    text += "Hope you have an enjoyable trip.\n\tAll the best,\n\tCareoplane";

        //    message.Body = text;

        //    SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
        //    {
        //        Credentials = new NetworkCredential("careoplane@gmail.com", "Careoplane11-9"),
        //        EnableSsl = true
        //    };

        //    try
        //    {
        //        client.Send(message);
        //    }
        //    catch (SmtpException ex)
        //    {
        //        Console.WriteLine(ex.ToString());
        //        throw ex;
        //    }
        //}

        public static void SendEmailVerification(AppUser applicationUser, string role, string token, string password)
        {
            MailAddress to = new MailAddress(applicationUser.Email, applicationUser.Name);
            MailAddress from = new MailAddress("careoplane@gmail.com", "Careoplane");

            MailMessage message = new MailMessage(from, to);
            message.Subject = "Careoplane - Verify Account";

            var link = string.Format("http://localhost:4200/main/confirmation?username={0}&token={1}", applicationUser.UserName, token);

            string text = string.Format("Hello {0},\n\n\t", applicationUser.Name);

            if (role == "aeroAdminNew" ||
                role == "racAdminNew" ||
                role == "sysAdmin")
            {
                text += string.Format("Your temporary password is {0}. Please make sure you change it on your first log in.\n\n\t", password);
            }

            text += string.Format("Please verify your account by visiting the link below\n\n\t{0}\n\n\t", link);
            if (role == "aeroAdminNew" ||
             role == "racAdminNew" ||
             role == "sysAdmin")
            {
                text += "We look forward to working with you,\n\tCareoplane";
            }
            else
            {
                text += "Hope you travel soon,\n\tCareoplane";
            }

            message.Body = text;

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("careoplane@gmail.com", "Careoplane11-9"),
                EnableSsl = true
            };
            // code in brackets above needed if authentication required 

            try
            {
                client.Send(message);
            }
            catch (SmtpException ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }
    }
}
