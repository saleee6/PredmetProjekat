using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.Models
{
    public class Friend
    {
        [Key]
        public int Id { get; set; }
        public AppUser FriendA { get; set; }
        public AppUser FriendB { get; set; }
        public string Status { get; set; }
    }
}
