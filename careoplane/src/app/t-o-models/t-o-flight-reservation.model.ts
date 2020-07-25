import { TOPrimaryObject } from './t-o-primary-object.model';

export class TOFlightReservation {
    public type = 'flight';

    constructor(
        public flightId: number,
        public seatId: number,
        public appUserName: string,
        public reservationId: number
    ) {}
}
