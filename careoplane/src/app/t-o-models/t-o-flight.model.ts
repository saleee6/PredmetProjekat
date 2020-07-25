import { TOSeat } from './t-o-seat.model';
import { TOPrimaryObject } from './t-o-primary-object.model';
import { Flight } from '../models/flight.model';
import { PriceSegmentSeat } from '../models/price-segment-seat.model';
import { TOPriceSegmentSeat } from './t-o-price-segment-seat.model';

export class TOFlight {
    constructor(
        public airlineName: string = null,
        public origin: string = null,
        public destination: string = null,
        public departure: string = null,
        public arrival: string = null, 
        public distance: number = null, 
        public connections: TOPrimaryObject[] = [],
        public flightId: number = null,
        public seats: TOSeat[] = [],
        public prices: number[] = [],
        public seatingArangement : TOPriceSegmentSeat[] = [],
        public segments : TOPriceSegmentSeat[] = [],
        public rating: number = 0,
        public version: number = 0
        ){}

        public convert(): Flight {
            let flight: Flight = new Flight(this.airlineName,this.origin,this.destination,
                new Date(this.departure), new Date(this.arrival),this.distance,this.connections,
                this.flightId,[],this.prices,this.seatingArangement,this.segments,this.rating, this.version);

            for(let seat of this.seats){
                let toSeat: TOSeat = Object.assign(new TOSeat(),seat);
                flight.seats.push(toSeat.convert());
            }

            flight.conCount = this.connections.length;
            let time = new Date(this.arrival).valueOf() - new Date(this.departure).valueOf();
            flight.durationHours = Math.floor(time/36e5);
            flight.durationMinutes = Math.floor(((time/36e5) -  Math.floor(time/36e5))*60);
    
            return flight;
        }
}
