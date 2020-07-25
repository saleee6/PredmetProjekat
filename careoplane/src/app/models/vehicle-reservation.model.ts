import { Vehicle } from './vehicle.model';
import { TOVehicleReservation } from '../t-o-models/t-o-vehicle-reservation.model';
import { RentACar } from './rent-a-car.model';
import { User } from './user.model';

export class VehicleReservation {
    constructor(
        public vehicleId: number,
        public fromDate: Date,
        public fromLocation: string,
        public toDate: Date,
        public toLocation: string,
        public numOfDays: number,
        public price: number,
        public creationDate: Date = new Date(),
        public type = 'vehicle',
        public isVehicleRated: boolean = false,
        public isRentACarRated: boolean = false,
    ) {}

    public ToTO(rentACar: RentACar): TOVehicleReservation {
        let user: User = JSON.parse(localStorage.getItem('user'));

        return new TOVehicleReservation(
            rentACar.ToTO(),
            user.userName,
            this.vehicleId,
            this.fromDate.toDateString(),
            this.fromLocation,
            this.toDate.toDateString(),
            this.toLocation,
            this.numOfDays,
            this.price,
            this.creationDate.toString(),
            this.type,
            this.isVehicleRated,
            this.isRentACarRated
        )
    }
}