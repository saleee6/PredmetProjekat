import { FlightReservationDetails } from './flight-reservation-details.model';
import { TOVehicle } from '../t-o-models/t-o-vehicle.model';

export class FlightReservation {
    public type = 'flight';

    constructor(
        public flightReservationDetails: FlightReservationDetails[] = [],
        public reservationId: number = 0,
        public timeOfCreation: string = null,
        public vehicleReservationId: number = 0,
        public creator: string = null,
        public finalPrice: number = 0
    ) {}
}