import { TOFastTicket } from './t-o-fast-ticket.model';
import { TOFlight } from './t-o-flight.model';
import { TOPrimaryObject } from './t-o-primary-object.model';
import { Airline } from '../models/airline.model';
import { FastTicket } from '../models/fast-ticket.model';
import { TOPriceSegmentSeat } from './t-o-price-segment-seat.model';
import { Seat } from '../models/seat.model';
import { TOSeat } from './t-o-seat.model';

export class TOAirline {
    public convert(): Airline {
        let airline = new Airline();

        airline.name = this.name;
        airline.address = this.address;
        airline.description = this.description;
        airline.destinations = this.destinations;
        airline.picture = this.image;
        airline.prices = this.prices;
        airline.rating = this.rating;
        airline.seatingArrangement = this.seatingArrangements;
        airline.segments = this.segmentLengths;

        for(let flight of this.flights){
            let toFlight: TOFlight = Object.assign(new TOFlight(),flight);
            airline.flights.push(toFlight.convert());
        }

        for(let fastTicket of this.fastTickets){
            for(let flight of airline.flights){
                if(flight.id == fastTicket.seat.flightId){
                    airline.fastTickets.push(new FastTicket(Object.assign(new TOSeat(),fastTicket.seat).convert()
                    , flight, fastTicket.airlineName,fastTicket.newPrice));
                }
            }
            
        }

        return airline;
    }

    constructor(
        public name: string = null, 
        public address: string = null,
        public description: string = null, 
        public prices : TOPriceSegmentSeat[] = [],
        public seatingArrangements: TOPriceSegmentSeat[] = [],
        public segmentLengths: TOPriceSegmentSeat[] = [],
        public flights: TOFlight[] = [],
        public image: string = "",
        public rating: number = 0,
        public destinations: TOPrimaryObject[] = [],
        public fastTickets: TOFastTicket[] = []){
    }
}