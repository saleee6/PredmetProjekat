import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';
import { VehicleReservation } from 'src/app/models/vehicle-reservation.model';
import { TOVehicleReservation } from 'src/app/t-o-models/t-o-vehicle-reservation.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { RatingComponent } from 'src/app/components/rating/rating.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vehicle } from 'src/app/models/vehicle.model';
import { TOVehicle } from 'src/app/t-o-models/t-o-vehicle.model';

@Component({
  selector: 'app-vehicle-reservation-details',
  templateUrl: './vehicle-reservation-details.component.html',
  styleUrls: ['./vehicle-reservation-details.component.scss']
})
export class VehicleReservationDetailsComponent implements OnInit {
  reservation: VehicleReservation;
  @Input() type: string = '';
  rentACarName: string = '';
  reservationId: number = 0;
  canCancel: boolean = false;
  notCombined: boolean = true;
  vehicle: Vehicle;

  @Input() id: number = null;

  constructor(
    private ratingDialog: MatDialog, 
    private activeRoute: ActivatedRoute, 
    private router: Router,
    private vehicleService: VehicleService,
    private rentACarService: RentACarService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reservation = new VehicleReservation(0, null, '', null, '', 0, 0);
    this.vehicle = new Vehicle('','',0,0,0);

    if (this.id != null) {
      if (this.type) {
        this.notCombined = false;
        this.vehicleService.getReservation(this.id).subscribe(
          (response: any) => {
            this.reservation = response;
            this.CheckTime();
            this.vehicleService.getCompanyForVehicle(this.reservation.vehicleId).subscribe(
              (result: any) => {
                this.rentACarName = result.company;
              },
              error => {
                console.log(error);
              }
            );
            this.vehicleService.getVehicle(this.reservation.vehicleId).subscribe(
              (result: TOVehicle) => {
                let tempVehicle = Object.assign(new TOVehicle('','',0,0,0,'',0,[],false,''), result);
                this.vehicle = tempVehicle.ToRegular();
              },
              error => {
                console.log(error);
              }
            );
          },
          error => {
            console.log(error);
          }
        );
      }
    } else {
      this.activeRoute.params.subscribe(
        params => {
          if (params['type']) {
            this.type = params['type'];
            this.reservationId = +params['id'];
            this.vehicleService.getReservation(this.reservationId).subscribe(
              (response: any) => {
                this.reservation = response;
                this.CheckTime();
                this.vehicleService.getCompanyForVehicle(this.reservation.vehicleId).subscribe(
                  (result: any) => {
                    this.rentACarName = result.company;
                  },
                  error => {
                    console.log(error);
                  }
                );
                this.vehicleService.getVehicle(this.reservation.vehicleId).subscribe(
                  (result: TOVehicle) => {
                    let tempVehicle = Object.assign(new TOVehicle('','',0,0,0,'',0,[],false,''), result);
                    this.vehicle = tempVehicle.ToRegular();
                  },
                  error => {
                    console.log(error);
                  }
                );
              },
              error => {
                console.log(error);
              }
            );
          }
        }
      );
    }
  }

  OnCancel() {
    this.vehicleService.cancelReservation(this.reservationId).subscribe(
      response => {
        this._snackBar.open('Reservation has been canceled successfully.', 'OK', {duration: 5000,});
        this.router.navigate(['../../../', 'reservations'], {relativeTo: this.activeRoute});
      },
      error => {
        console.log(error);
      }
    );
  }

  RateVehicle() {
    let dialogRef = this.ratingDialog.open(
      RatingComponent, {
      }
    );
    
    dialogRef.afterClosed()
    .subscribe(
      (result) => {
        if(result != undefined) {
          this.vehicleService.rateVehicle(this.reservation.vehicleId, result, this.reservationId).subscribe(
            response => {
              this.reservation.isVehicleRated = true;
            },
            error => {
              console.log(error);
            }
          );
        }
      });
  }

  RateRentACar() {
    let dialogRef = this.ratingDialog.open(
      RatingComponent, {
      }
    );
    
    dialogRef.afterClosed()
    .subscribe(
      (result) => {
        if(result != undefined) {
          this.rentACarService.rateRentACar(this.rentACarName, result, this.reservationId).subscribe(
            response => {
              this.reservation.isRentACarRated = true;
            },
            error => {
              console.log(error);
            }
          );
        }
      });
  }

  CheckTime() {
    if (this.reservation != null) {
      if (new Date(this.reservation.fromDate).valueOf() - (2*24*60*60*1000) < new Date().valueOf()) {
        this.canCancel = false;
      } else {
        this.canCancel = true;
      }
    } 
    else {
      this.canCancel = false;
    }
  }
  
}
