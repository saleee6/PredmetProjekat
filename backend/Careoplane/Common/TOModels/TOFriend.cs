using Common.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Common.TOModels
{
    public class TOFriend
    {
        public int Id { get; set; }

        public AppUser FriendA { get; set; }
        public AppUser FriendB { get; set; }
        public string Status { get; set; }

        public TOFriend() { }
        public TOFriend(Friend friend) {
            Id = friend.Id;
            FriendA = friend.FriendA;
            FriendB = friend.FriendB;
            Status = friend.Status;
        }
    }
}
