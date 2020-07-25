using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.TOModels
{
    public class TOAppUser
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string City { get; set; }
        public string PhoneNumber { get; set; }
        public string Company { get; set; }
        public string Role { get; set; }
        public bool IsFirstLogIn { get; set; }
        public List<TOFriend> friendsA { get; set; } 
        public List<TOFriend> friendsB { get; set; } 

        //Lista rezervacija
    }
}
