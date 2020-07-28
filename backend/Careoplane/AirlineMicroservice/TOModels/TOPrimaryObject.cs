using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirlineMicroservice.TOModels
{
    public class TOPrimaryObject
    {
        public int Id { get; set; }
        public object Value { get; set; }
        public object Reference { get; set; }

        public TOPrimaryObject() { }

        public TOPrimaryObject(int id, object value, object reference)
        {
            Id = id;
            Value = value;
            Reference = reference;
        }
    }
}
