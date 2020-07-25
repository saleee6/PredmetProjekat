import { Seat } from './seat.model';
import { Flight } from './flight.model';

export class FastTicket{
    constructor(public seat: Seat = null, public flight: Flight = null, public airlineName: string = null, public newPrice: number = 0){
    }
}