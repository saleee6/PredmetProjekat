import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { Subject } from 'rxjs';
import { VehicleReservation } from '../models/vehicle-reservation.model';
import { RentACar } from '../models/rent-a-car.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    constructor(private http: HttpClient) {
        
    }

    vehicleListChanged = new Subject<Vehicle[]>();
    vehicleReservationCreated = new Subject<VehicleReservation>();
    vehicleRentACar = new Subject<RentACar>();
    vehicleForReservation = new Subject<Vehicle>();

    getVehiclesForCompany(company: string) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/ForCompany';
        var params = new HttpParams().append('company', company);
        return this.http.get(address, {params: params});
    }

    getVehiclesForUser() {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/VehicleReservations/ForUser';
        return this.http.get(address);
    }

    getReservation(reservationId: number) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/VehicleReservations/' + reservationId.toString();
        
        return this.http.get(address);
    }

    getReservationsForVehicles(vehicleIds: number[]) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/VehicleReservations/ForVehicles';
        let ids: string = '';
        vehicleIds.forEach(id => ids+=id.toString() + ',');
        var params = new HttpParams().append('vehicleIds', ids);
        
        return this.http.get(address, {params: params});
    }

    getCompanyForVehicle(vehicleId: number) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/Company';
        var params = new HttpParams().append('vehicleId', vehicleId.toString());
        
        return this.http.get(address, {params: params});
    }

    rateVehicle(vehicleId: number, rating: number, reservationId: number) {
        let address ='http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/Rate';
        let params = {
        'vehicleId': vehicleId,
        'rating': rating,
        'reservationId': reservationId
        };
        return this.http.put(address, params);
    }

    cancelReservation(reservationId: number) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/VehicleReservations/' + reservationId;
        return this.http
        .delete(
            address
        );
    }

    postVehicle(newVehicle: Vehicle) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles';
        return this.http
        .post(
            address,
            newVehicle.ToTO()
        );
    }

    deleteVehicle(vehicle: Vehicle) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/' + vehicle.vehicleId + "?version=" + vehicle.version;
        return this.http
        .delete(
            address
        );
    }

    putVehicle(updatedVehicle: Vehicle) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/' + updatedVehicle.vehicleId;
        return this.http
        .put(
            address,
            updatedVehicle.ToTO()
        );
    }

    reserveVehicle(reservation: VehicleReservation, rentACar: RentACar, version: number) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/VehicleReservations?version=' + version;
        return this.http
        .post(
            address,
            reservation.ToTO(rentACar)
        );
    }

    getVehiclesOnSale(location: string, fromDate: Date, toDate: Date) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/OnSale';
        var params = new HttpParams()
        .append('location', location)
        .append('fromDate', fromDate.toDateString())
        .append('toDate', toDate == null ? '' : toDate.toDateString());
        
        return this.http.get(address, {params: params});
    }

    getVehicle(vehicleId: number) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Vehicles/' + vehicleId.toString();
        return this.http
        .get(
            address
        );
    }
}