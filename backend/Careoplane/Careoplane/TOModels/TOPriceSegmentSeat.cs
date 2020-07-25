using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Careoplane.TOModels
{
    public class TOPriceSegmentSeat
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public int Ordinal { get; set; }
        public string Reference { get; set; }

        public TOPriceSegmentSeat() { }

        public TOPriceSegmentSeat(int id, double value, int ordinal, string reference)
        {
            Id = id;
            Value = value;
            Ordinal = ordinal;
            Reference = reference;
        }
    }
}
