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
using AirlineMicroservice.TOModels;

namespace AirlineMicroservice.Services
{
    public static class MailingService
    {
        public static void SendEMailInvite(AppUser inviter, AppUser user, TOFlightReservation flightReservation, VehicleForEmail vehicle, int id)
        {
            MailAddress to = new MailAddress(user.Email, user.Name);
            MailAddress from = new MailAddress("careoplane@gmail.com", "Careoplane");

            MailMessage message = new MailMessage(from, to);
            message.Subject = "Careoplane - Invitation";

            var link = string.Format("http://localhost:4200/main/flight-reservation-details?username={0}&id={1}", user.UserName, id);

            string text = string.Format("Hello {0},\n\n\tUser {1} {2}, has invited you to travel with him/her. Below are flight details:\n\t", user.Name, inviter.Name, inviter.Surname);
            foreach (TOFlightReservationDetail tOFlightReservationDetail in flightReservation.FlightReservationDetails)
            {
                text += string.Format("\tFlight ({4}): from {0} ({1}) to {2} ({3})\n\t", tOFlightReservationDetail.Flight.Origin, tOFlightReservationDetail.Flight.Departure.ToString(), tOFlightReservationDetail.Flight.Destination, tOFlightReservationDetail.Flight.Arrival.ToString(), tOFlightReservationDetail.Flight.AirlineName);
            }

            if (vehicle != null)
            {
                text += string.Format("\tVehicle ({1}): {0}\n", vehicle.Brand, vehicle.RentACarName);
            }

            text += string.Format("\nIf you would like to accept or decline this invitaion, please follow this link {0}\n\n\t", link);
            text += "Hope you have an enjoyable trip.\n\tAll the best,\n\tCareoplane";

            message.Body = text;

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("careoplane@gmail.com", "Careoplane!1"),
                EnableSsl = true
            };

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

        public static void SendEMailReceipt(AppUser user, TOFlightReservation flightReservation, VehicleForEmail vehicle)
        {
            MailAddress to = new MailAddress(user.Email, user.Name);
            MailAddress from = new MailAddress("careoplane@gmail.com", "Careoplane");

            MailMessage message = new MailMessage(from, to);
            message.Subject = "Careoplane - Receipt";

            string text = string.Format("Hello {0},\n\n\tRecently you have made a reservation on our website. Below are your reservation details:\n\t", user.Name);
            foreach (TOFlightReservationDetail tOFlightReservationDetail in flightReservation.FlightReservationDetails)
            {
                text += string.Format("\tFlight ({4}): from {0} ({1}) to {2} ({3})\n\t", tOFlightReservationDetail.Flight.Origin, tOFlightReservationDetail.Flight.Departure.ToString(), tOFlightReservationDetail.Flight.Destination, tOFlightReservationDetail.Flight.Arrival.ToString(), tOFlightReservationDetail.Flight.AirlineName);
            }

            if (vehicle != null)
            {
                text += string.Format("\tVehicle ({1}): {0}\n\n", vehicle.Brand, vehicle.RentACarName);
            }

            text += string.Format("Final price: €{0}\n\n\t", flightReservation.FinalPrice);
            text += "Hope you have an enjoyable trip.\n\tAll the best,\n\tCareoplane";

            message.Body = text;

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("careoplane@gmail.com", "Careoplane!1"),
                EnableSsl = true
            };

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
