//using Careoplane.Database;
//using Common.TOModels;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using System.Linq;
//using System.Threading.Tasks;

//namespace Common.Models
//{
//    public class FastTicket
//    {
//        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
//        public int SeatId { get; set; }
        
//        [Required]
//        public Airline Airline { get; set; }

//        public double NewPrice { get; set; }

//        public FastTicket() { }
        
//        public FastTicket(TOFastTicket fastTicket, DatabaseContext _context)
//        {
//            SeatId = fastTicket.Seat.SeatId;
//            Airline = _context.Airlines.Find(fastTicket.AirlineName);
//            NewPrice = fastTicket.NewPrice;
//        }
//    }
//}