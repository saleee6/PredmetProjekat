import { Flight } from './flight.model';
import { StringifyOptions } from 'querystring';
import { Seat } from './seat.model';
import { FastTicket } from './fast-ticket.model';
import { TOPrimaryObject } from '../t-o-models/t-o-primary-object.model';
import { PriceSegmentSeat } from './price-segment-seat.model';

export class Airline {
    constructor(
        public name: string = null, 
        public address: string = null,
        public description: string = null, 
        public prices : PriceSegmentSeat[] = [],
        public seatingArrangement: PriceSegmentSeat[] = [],
        public segments: PriceSegmentSeat[] = [],
        public flights: Flight[] = [],
        public picture: string = "",
        public rating: number = 0,
        public destinations: TOPrimaryObject[] = [],
        public fastTickets: FastTicket[] = []){
    }
}