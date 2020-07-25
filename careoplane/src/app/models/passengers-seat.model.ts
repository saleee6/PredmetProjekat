import { Seat } from './seat.model';

export class PassengersSeat {
    constructor(
        public seat: Seat = null,
        public username: string = null,
        public name: string = null,
        public surname: string = null,
        public passport: string = null,
        public passengeSeatId: number = 0,
        public flightReservationDetailId: number = 0,
        public accepted: boolean = false,
        public airlineScored: boolean = false,
        public flightScored: boolean = false)
        {}
}