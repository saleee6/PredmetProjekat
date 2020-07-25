import { TOSeat } from './t-o-seat.model';
import { TOFlight } from './t-o-flight.model';
import { FastTicket } from '../models/fast-ticket.model';

export class TOFastTicket{
 
    constructor(public seat: TOSeat = null,public airlineName: string = null, public newPrice: number = 0)
    {
    }
}