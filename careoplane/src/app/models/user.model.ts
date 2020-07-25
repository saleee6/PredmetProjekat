import { TOUser } from '../t-o-models/t-o-user.model';
import { TOFriend } from '../t-o-models/t-o-friend.model';
import { TOFlightReservation } from '../t-o-models/t-o-flight-reservation.model';
import { FlightReservation } from './flight-reservation.model';

export class User {
    constructor(
        public role: string,
        public userName: string,
        public email: string,
        public password: string,
        public name: string,
        public surname: string,
        public city: string,
        public phoneNumber: string,
        public reservations: any[] = [],
        public company: string = '',
        public tOFriendsA: TOFriend[] = [],
        public tOFriendsB: TOFriend[] = [],
        public toFlightReservation: FlightReservation[] = [],
        public numberOfPoint: number = 0
    ) {}

    public ToTO(): TOUser {
        return new TOUser(
            this.password,
            this.name,
            this.surname,
            this.city,
            this.phoneNumber
        );
    }
}