import { TOVehicle } from '../t-o-models/t-o-vehicle.model';
import { TOPrimaryObject } from '../t-o-models/t-o-primary-object.model';
import { RentACar } from './rent-a-car.model';

export class Vehicle {
    constructor(
        public brand: string,
        public type: string,
        public numOfSeats: number,
        public year: number,
        public pricePerDay: number,
        public location: string = '',
        public rating: number = 0,
        public unavailableDates: Date[] = [],
        public isOnSale: boolean = false,
        public rentACar: string = '',
        public vehicleId: number = 0,
        public version: number = 0
    ) {}

    public ToTO(): TOVehicle {
        let toUnavailableDates: TOPrimaryObject[] = [];
        this.unavailableDates.forEach(
            d => {
                toUnavailableDates.push(new TOPrimaryObject(0, d.toDateString(), this));
            }
        );
        return new TOVehicle(
            this.brand,
            this.type,
            this.numOfSeats,
            this.year, 
            this.pricePerDay,
            this.location,
            this.rating,
            toUnavailableDates,
            this.isOnSale,
            this.rentACar,
            this.vehicleId,
            this.version
        );
    }
}