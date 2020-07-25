import { Injectable } from '@angular/core';
import { RentACar } from '../models/rent-a-car.model';
import { Vehicle } from '../models/vehicle.model';
import { Subject, Observable } from 'rxjs';
import { VehicleReservation } from '../models/vehicle-reservation.model';
import { HttpClient } from '@angular/common/http'
import { TORentACar } from '../t-o-models/t-o-rent-a-car.model';

@Injectable({
    providedIn: 'root'
})
export class RentACarService {
    constructor(private http: HttpClient) {

    }

    vehicleTypes: string[] = [
        'Any',
        'Car',
        'Van',
        'Truck'
    ];

    vehicles: Vehicle[] = [
        new Vehicle('BMW', 'Car', 5, 2019, 200),
        new Vehicle('Mercedes-Benz', 'Van', 3, 2015, 150),
        new Vehicle('FAP', 'Truck', 2, 2014, 200),
        new Vehicle('BMW', 'Car', 5, 2016, 220),
        new Vehicle('Mercedes-Benz', 'Van', 3, 2018, 180),
        new Vehicle('FAP', 'Truck', 2, 2020, 170),
        new Vehicle('BMW', 'Car', 5, 2016, 130),
        new Vehicle('Mercedes-Benz', 'Van', 3, 2019, 140),
        new Vehicle('FAP', 'Truck', 2, 2015, 100),
    ];
    
    public rentACars: RentACar[] = [];

    rentACarsChanged = new Subject<RentACar[]>();
    vehicleListChanged = new Subject<Vehicle[]>();
    rentACarChanged = new Subject<RentACar>();
    reservationMade = new Subject<any>();
    onSaleClicked = new Subject<boolean>();
    vehicleSwaped = new Subject<boolean>();
    locationLoadedSubject = new Subject<string>();

    newVehicleListChanged = new Subject<Vehicle[]>();
    newVehicles: Vehicle[] = [];

    getRentACar(RentACarName: string) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/RentACars/' + RentACarName;
        return this.http
        .get(
            address
        );
    }

    getRentACars() {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/RentACars';
        return this.http
        .get(
            address
        );
    }

    getRentACarByName(name: string): RentACar {
        for (var rentACar of this.rentACars) {
            if (rentACar.name === name) {
                return rentACar;
            }
        }
    }

    getRentACarIndex(rentACar: RentACar): number {
        return this.rentACars.indexOf(rentACar);
    }

    getRentACarByIndex(index: number): RentACar {
        return this.rentACars[index];
    }

    getVehicleForRentACar(indexRentACar: number, indexVehicle: number) {
        return this.rentACars[indexRentACar].vehicles[indexVehicle];
    }

    getVehicleForRentACarByName(rentACarName: string, indexVehicle: number) {
        let index = this.getRentACarIndex(this.getRentACarByName(rentACarName));
        return this.getVehicleForRentACar(index, indexVehicle);
    }

    getVehicleTypes(): string[] {
        return this.vehicleTypes.slice();
    }

    getTempVehicle(indexVehicle: number) {
        return this.newVehicles[indexVehicle];
    }

    addRentACar(newRentACar: RentACar) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/RentACars';
        return this.http
        .post(
            address,
            newRentACar.ToTO()
        );
    }

    editRentACar(updatedRentACar: RentACar) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/RentACars/' + updatedRentACar.name;
        return this.http
        .put(
            address,
            updatedRentACar.ToTO()
        );
    }

    addTempVehicle(vehicle: Vehicle) {
        this.newVehicles.push(vehicle);
        this.newVehicleListChanged.next(this.newVehicles.slice());
    }

    removeTempVehicle(vehicleIndex: number) {
        this.newVehicles.splice(vehicleIndex, 1);
        this.newVehicleListChanged.next(this.newVehicles.slice());
    }

    // editVehicle(rentACar: RentACar, vehicleIndex: number, newBrand: string, newSeats: number, newPrice: number, newLocation: string) {
    //     let index = this.getRentACarIndex(rentACar);
    //     this.rentACars[index].vehicles[vehicleIndex].brand = newBrand;
    //     this.rentACars[index].vehicles[vehicleIndex].numOfSeats = newSeats;
    //     this.rentACars[index].vehicles[vehicleIndex].pricePerDay = newPrice;
    //     this.rentACars[index].vehicles[vehicleIndex].location = newLocation;
    //     this.vehicleListChanged.next(this.rentACars[index].vehicles.slice());
    //     this.rentACarChanged.next(this.rentACars[index]);
    // }

    // reserveVehicle(rentACar: RentACar, vehicleIndex: number, reservation: VehicleReservation) {
    //     let index = this.getRentACarIndex(rentACar);
    //     for (let i = 0; i < reservation.numOfDays; i++) {
    //         let day = new Date();
    //         day.setDate(reservation.fromDate.getDate() + i);
    //         this.rentACars[index].vehicles[vehicleIndex].unavailableDates.push(day);
    //     }
    //     this.rentACarChanged.next(this.rentACars[index]);
    //     this.vehicleListChanged.next(this.rentACars[index].vehicles.slice());
    //     this.reservationMade.next();
    // }

    swapVehicleList(rentACar: RentACar, vehicleIndex: number) {
        
        // let index = this.getRentACarIndex(rentACar);
        // this.rentACars[index].vehicles[vehicleIndex].isOnSale = !this.rentACars[index].vehicles[vehicleIndex].isOnSale;
        this.vehicleSwaped.next(!rentACar.vehicles[vehicleIndex].isOnSale);
    }

    editTempVehicle(vehicleIndex: number, newBrand: string, newSeats: number, newPrice: number, newLocation: string) {
        this.newVehicles[vehicleIndex].brand = newBrand;
        this.newVehicles[vehicleIndex].numOfSeats = newSeats;
        this.newVehicles[vehicleIndex].pricePerDay = newPrice;
        this.newVehicles[vehicleIndex].location = newLocation;
        this.newVehicleListChanged.next(this.newVehicles.slice());
    }

    rateRentACar(rentACarName: string, rating: number, reservationId: number) {
        let address ='http://localhost:' + localStorage.getItem('port') + '/api/RentACars/Rate';
        let params = {
        'rentACarName': rentACarName,
        'rating': rating,
        'reservationId': reservationId
        };
        return this.http.put(address, params);
    }

    getVehiclesOnSale(): Vehicle[] {
        let vehiclesOnSale: Vehicle[] = [];

        for (let rentACar of this.rentACars) {
            for (let vehicle of rentACar.vehicles) {
                if (vehicle.isOnSale) {
                    vehiclesOnSale.push(vehicle);
                }
            }
        }

        return vehiclesOnSale;
    }

    reserveObservable: Observable<any>;

    doNextOnReserve( 
        pickUpDate: Date,
        pickUpLocation: string,
        returnDate: Date,
        returnLocation: string) {
        this.reserveObservable = Observable.create(
            observer => {
              observer.next({
                  'pickUpDate': pickUpDate,
                  'pickUpLocation': pickUpLocation,
                  'returnDate': returnDate,
                  'returnLocation': returnLocation,
              })
            }
          );
    }

    locationLoaded(address: string){
        this.locationLoadedSubject.next(address);
    }

    getDiscountForVehicles() {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Discounts/Vehicle';
        return this.http.get(address);
    }
}
