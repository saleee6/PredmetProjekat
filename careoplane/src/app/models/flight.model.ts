import { Seat } from './seat.model';
import { TOPrimaryObject } from '../t-o-models/t-o-primary-object.model';
import { PriceSegmentSeat } from './price-segment-seat.model';

export class Flight {
    public conCount: number;
    public durationHours: number;
    public durationMinutes: number;
            
    constructor(
        public airlineName: string = null,
        public origin: string = null,
        public destination: string = null,
        public departure: Date = null,
        public arrival: Date = null, 
        public distance: number = 0, 
        public connections: TOPrimaryObject[] = [],
        public id: number = 0,
        public seats: Seat[] = [],
        public prices: number[] = [],
        public seatingArangement : PriceSegmentSeat[] = [],
        public segments : PriceSegmentSeat[] = [],
        public rating: number = 0,
        public version: number = 0
        ){
            this.conCount = connections.length;
            let time = new Date(arrival).valueOf() - new Date(departure).valueOf();
            this.durationHours = Math.floor(time/36e5);
            this.durationMinutes = Math.floor(((time/36e5) -  Math.floor(time/36e5))*60);
        }
}
