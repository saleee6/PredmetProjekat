import { TOPrimaryObject } from './t-o-primary-object.model';
import { Seat } from '../models/seat.model';

export class TOSeat {
    convert(): Seat {
        let seat : Seat = new Seat();
        seat.discount = this.discount;
        seat.flightId = this.flightId;
        seat.seatId = this.seatId;
        seat.name = this.name;
        seat.occupied = this.occupied;
        seat.price = this.price;
        seat.type = this.type;

        return seat;
    }
    constructor(
        public flightId: number = 0,
        public name: string = null,
        public type: string = null,
        public occupied: boolean = false,
        public price: number = 0,
        public discount: number = 0,
        public seatId: number = 0){}
}