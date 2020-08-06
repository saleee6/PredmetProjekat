using Common.TOModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Common.Models
{
    public class AppUser : Microsoft.AspNetCore.Identity.IdentityUser //<string>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string City { get; set; }
        public string Company { get; set; }
        public bool IsFirstLogIn { get; set; }
        public List<Friend> FriendsA { get; set; }
        public List<Friend> FriendsB { get; set; }
        public int NumberOfPoint { get; set; }

        public TOAppUser ToTO()
        {
            return new TOAppUser()
            {
                UserName = UserName,
                Email = Email,
                Password = "",
                Name = Name,
                Surname = Surname,
                City = City,
                PhoneNumber = PhoneNumber,
                Company = Company,
                Role = "",
                IsFirstLogIn = IsFirstLogIn
            };
        }

        public void FromTO(TOAppUser toAppUser)
        {
            UserName = toAppUser.UserName;
            Email = toAppUser.Password;
            Name = toAppUser.Name;
            Surname = toAppUser.Surname;
            City = toAppUser.City;
            PhoneNumber = toAppUser.PhoneNumber;
            Company = toAppUser.Company;
            IsFirstLogIn = toAppUser.IsFirstLogIn;
        }
    }
}
