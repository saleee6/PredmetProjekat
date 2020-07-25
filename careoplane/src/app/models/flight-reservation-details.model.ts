import { PassengersSeat } from './passengers-seat.model';
import { TOFlight } from '../t-o-models/t-o-flight.model';

export class FlightReservationDetails {
    constructor(
        public flight: TOFlight = null, 
        public passengerSeats: PassengersSeat[] = [],
        public flightReservationDetailId: number = 0,
        public flightReservationId: number = 0)
        {
        }
}