using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.Models
{
    public class Discount
    {
        [Key]
        public int DiscountId { get; set; }

        public string Type { get; set; }

        public double DiscountValue { get; set; }
    }
}
