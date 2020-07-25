import { Vehicle } from '../models/vehicle.model';
import { TOPrimaryObject } from './t-o-primary-object.model';
import { TOVehicle } from './t-o-vehicle.model';
import { RentACar } from '../models/rent-a-car.model';
import { formatPercent } from '@angular/common';

export class TORentACar {
    public constructor(
        public name: string, 
        public address: string,
        public description: string,
        public vehicles: TOVehicle[] = [],
        public locations: TOPrimaryObject[] = [],
        public rating: number = 0,
        public prices: TOPrimaryObject[] = []) {
    }

    public ToRegular(): RentACar {
        let locations: string[] = [];
        this.locations.forEach(
            l => {
                locations.push(l.value);
            }
        );
        let prices: number[] = [];
        this.prices.forEach(
            p => {
                prices.push(p.value);
            }
        );
        let vehicles: Vehicle[] = [];
        this.vehicles.forEach(
            (v: any) => {
                let toVehicle: TOVehicle = Object.assign(new TOVehicle('', '', 0, 0, 0,'',0,[], false, ''), v);
                vehicles.push(toVehicle.ToRegular());
            }
        );
        return new RentACar(
            this.name,
            this.address,
            this.description,
            vehicles,
            locations,
            this.rating,
            prices
        );
    }
}