import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { Url } from 'url';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  @Output() reserveClicked = new EventEmitter();

  vehicle: Vehicle;
  idRentACar: number;
  idVehicle: number;
  subscription: Subscription;
  adminVehicleId: number;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  rentACar: RentACar;
  discount = 0;
  isReserved: boolean = false;

  // displayedColumns: string[] = ['brand', 'year', 'type', 'seats', 'price', 'location', 'rating'];

  constructor(
    private rentACarService: RentACarService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isReserved = false;
    this.vehicle = new Vehicle('', '', 0, 0, 0);
    this.isLoggedIn = localStorage.getItem('role') === null ? false : true;
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
        // this.idRentACar = +params['id'];
        this.adminVehicleId = +params['idvh']; //U pitanju je profil servisa
        this.isReserved = false;
        if (this.adminVehicleId === undefined || Number.isNaN(this.adminVehicleId)) {
          this.idRentACar = +(this.router.url.split('/')[3])
          this.idVehicle = +params['idv'];
          this.vehicle = this.rentACarService.getVehicleForRentACar(this.idRentACar, this.idVehicle);
        } else {
          if (this.router.url.includes('new')) {
            this.vehicle = this.rentACarService.newVehicles[this.adminVehicleId];
          } else {
            this.idRentACar = +(this.router.url.split('/')[3]);
            let company = localStorage.getItem('company') === null ? '' : localStorage.getItem('company');
            this.rentACarService.getRentACar(localStorage.getItem('company')).subscribe(
              (response : any) => {
                  let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), response);
                  this.rentACar = toRentACar.ToRegular();
                  this.vehicle = this.rentACar.vehicles[this.adminVehicleId];
                  this.vehicle.unavailableDates.forEach(date => {
                    var checkDate = new Date(date);
                    var today = new Date();
                    today.setHours(0,0,0,0);

                    if(checkDate >= today) {
                      this.isReserved = true;
                    }
                  });
              },
              error => {
                  console.log(error);
              });
            // this.rentACar = this.rentACarService.getRentACarByName(this.userService.getLoggedInUser().company);
            // this.vehicle = this.rentACarService.getVehicleForRentACarByName(this.userService.getLoggedInUser().company, this.adminVehicleId);
            this.isAdmin = true;
          }
        }
      }
    );
  }

  onReserve() {
    // this.rentACarService.doNextOnReserve(new Date(), 'A', new Date(), 'B');
    this.router.navigate(['../', 'reserve'], {relativeTo: this.route});
  }

  onEditVehicle() {
    this.router.navigate(['../', 'edit'], {relativeTo: this.route});
  }

  onRemoveVehicle() {
    this.vehicleService.deleteVehicle(this.vehicle).subscribe(
      (response: any) => {
        if (response.success) {
          this.rentACar.vehicles.splice(this.rentACar.vehicles.indexOf(this.vehicle), 1);
          this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
          this._snackBar.open('Vehicle removed successfully', 'OK', {duration: 5000,});
          this.router.navigate(['../../'], {relativeTo: this.route});
        } else {
          this._snackBar.open('Someone has made a reservation before the change/s could be saved', 'OK', {duration: 5000,});
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onSwapVehicle() {
    let index = +this.router.url.split('/')[3];
    // this.vehicle.isOnSale = !this.vehicle.isOnSale;
    this.rentACar.vehicles[index].isOnSale = !this.rentACar.vehicles[index].isOnSale;
    this.rentACarService.vehicleSwaped.next(!this.rentACar.vehicles[index].isOnSale);
    // this.rentACarService.swapVehicleList(this.rentACar, index);
    this.vehicleService.putVehicle(this.vehicle).subscribe(
      response => {
        this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
        this.router.navigate(['../../'], {relativeTo: this.route});
      },
      error => {
        console.log(error);
      }
    );
  }

  checkRole(){
    return localStorage.getItem('role');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
