import { Vehicle } from './vehicle.model';
import { TORentACar } from '../t-o-models/t-o-rent-a-car.model';
import { TOPrimaryObject } from '../t-o-models/t-o-primary-object.model';
import { TOVehicle } from '../t-o-models/t-o-vehicle.model';

export class RentACar {
    public constructor(
        public name: string, 
        public address: string,
        public description: string,
        public vehicles: Vehicle[] = [],
        public locations: string[] = [],
        public rating: number = 0,
        public prices: number[] = [0, 0, 0],
        public pricelist: { [service: string] : number; } = {}) {
            pricelist['Car'] = prices[0];
            pricelist['Van'] = prices[1];
            pricelist['Truck'] = prices[2];

            // let location: string = this.address.split(',')[1];
            // this.vehicles.forEach(
            //     v => {
            //         v.location = location.substr(1);
            //         v.rentACar = name;
            //     }
            // );
    }

    public ToTO(): TORentACar {
        let toLocations: TOPrimaryObject[] = [];
        this.locations.forEach(
            l => {
                toLocations.push(new TOPrimaryObject(0, l, this));
            }
        );
        let toPrices: TOPrimaryObject[] = [];
        this.prices.forEach(
            p => {
                toPrices.push(new TOPrimaryObject(0, p, this));
            }
        );
        let toVehicles: TOVehicle[] = [];
        this.vehicles.forEach(
            v => {
                toVehicles.push(v.ToTO());
            }
        );
        return new TORentACar(
            this.name,
            this.address,
            this.description,
            toVehicles,
            toLocations,
            this.rating,
            toPrices
        );
    }
}