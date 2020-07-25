import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Vehicle } from 'src/app/models/vehicle.model';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { Subscription, Observable } from 'rxjs';
import { VehicleReservation } from 'src/app/models/vehicle-reservation.model';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-reserve',
  templateUrl: './vehicle-reserve.component.html',
  styleUrls: ['./vehicle-reserve.component.css']
})
export class VehicleReserveComponent implements OnInit, OnDestroy {
  vehicle: Vehicle;
  rentACar: RentACar;
  subscription: Subscription;
  indexVehicle;

  pickUpDate;
  pickUpLocation;
  returnDate;
  returnLocation;
  numOfDays = 1;
  discount = 0;

  constructor(
    private userService: UserService,
    private rentACarService: RentACarService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) 
    { }

  ngOnInit(): void {
    this.rentACarService.getDiscountForVehicles().subscribe(
      (result: any) => {
        this.discount = result.discount;
      },
      error => {
        console.log(error);
      }
    );

    this.subscription = this.route.params
    .subscribe(
      (params: Params) => {
        const indexRentACar = +(this.router.url.split('/')[3]);
        this.indexVehicle = +(this.router.url.split('/')[5]);
        this.rentACar = this.rentACarService.getRentACarByIndex(indexRentACar);
        this.vehicle = this.rentACar.vehicles[this.indexVehicle];
    });

    this.rentACarService.reserveObservable.subscribe(data => {
      // console.log(data['pickUpDate']);
      // console.log(data['pickUpLocation']);
      // console.log(data['returnDate']);
      // console.log(data['returnLocation']);
      this.pickUpDate = data['pickUpDate'];
      this.pickUpLocation = data['pickUpLocation'];
      this.returnDate = data['returnDate'];
      this.returnLocation = data['returnLocation'];
      this.numOfDays = (this.returnDate - this.pickUpDate)  / 1000 / 60 / 60 / 24 + 1;
    });
  }

  onCancel() {
    this.router.navigate(['../', 'details'], {relativeTo: this.route});
  }

  onReserve() {
    let reservation = new VehicleReservation(
      this.vehicle.vehicleId,
      this.pickUpDate,
      this.vehicle.location,
      this.returnDate,
      this.returnLocation,
      this.numOfDays,
      this.rentACar.pricelist[this.vehicle.type] + this.vehicle.pricePerDay * this.numOfDays
    );

    this.vehicleService.reserveVehicle(reservation, this.rentACar, this.vehicle.version).subscribe(
      (response: any) => {
        if (response.success) {
          console.log(response)
          this.router.navigate(['../../'], {relativeTo: this.route});
          this._snackBar.open('Reservation made successfully', 'OK', { duration: 5000, });
        } else {
          this._snackBar.open('Something went wrong', 'OK', { duration: 5000, });
        }
      },
      error => {
        console.log(error);
      }
    );

    //this.userService.addReservation(reservation);
    //this.rentACarService.reserveVehicle(this.rentACar, this.indexVehicle, reservation);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
