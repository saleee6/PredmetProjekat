import { TOPrimaryObject } from './t-o-primary-object.model';
import { Vehicle } from '../models/vehicle.model';

export class TOVehicle {
    constructor(
        public brand: string,
        public type: string,
        public numOfSeats: number,
        public year: number,
        public pricePerDay: number,
        public location: string = '',
        public rating: number = 0,
        public unavailableDates: TOPrimaryObject[] = [],
        public isOnSale: boolean = false,
        public rentACar: string,
        public vehicleId: number = 0,
        public version: number = 0
    ) {}

    public ToRegular(): Vehicle {
        let unavailableDates: Date[] = [];
        this.unavailableDates.forEach(
            d => {
                unavailableDates.push(new Date(d.value));
            }
        );
        return new Vehicle(
            this.brand,
            this.type,
            this.numOfSeats,
            this.year,
            this.pricePerDay,
            this.location,
            this.rating,
            unavailableDates,
            this.isOnSale,
            this.rentACar,
            this.vehicleId,
            this.version
        );
    }
}