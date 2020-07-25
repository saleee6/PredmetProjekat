using Careoplane.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.Database
{
    public class AuthenticationContext : IdentityDbContext
    {
        public AuthenticationContext(DbContextOptions<AuthenticationContext> options): base(options) { }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Friend> Friends { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>().HasMany(user => user.FriendsA).WithOne(f => f.FriendA);
            modelBuilder.Entity<AppUser>().HasMany(user => user.FriendsB).WithOne(f => f.FriendB);
        }
    }
}
