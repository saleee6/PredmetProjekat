import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { Router, ActivatedRoute, Params, UrlTree } from '@angular/router';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { UserService } from 'src/app/services/user.service';
import { Vehicle } from 'src/app/models/vehicle.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscriber, Subscription, Observable } from 'rxjs';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-manager',
  templateUrl: './vehicle-manager.component.html',
  styleUrls: ['./vehicle-manager.component.css']
})
export class VehicleManagerComponent implements OnInit, OnDestroy {
  rentACar: RentACar;
  addForm: FormGroup;
  maxYear: Date;
  vehicleTypes: string[] = [];
  locations: string[] = [];
  vehicleIndex: number;
  isEdit: boolean = true;
  isNew = false;
  vehicle: Vehicle;
  indexLocation: number;
  indexType: number;
  subscribtion: Subscription;

  constructor(
    private rentACarService: RentACarService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // if (this.router.url.includes('new')) {
    //   this.vehicleTypes = this.rentACarService.getVehicleTypes();
    //   this.vehicleTypes.splice(0, 1);
    //   if (!this.router.url.includes('edit')) {
    //     this.isEdit = false;
    //   } else {
    //     this.indexLocation = 0;
    //     this.vehicleIndex = +this.router.url.split('/')[3];
    //     this.vehicle = this.rentACarService.getTempVehicle(this.vehicleIndex);
    //   }
    //   this.locations = ['HQ'];
    //   this.isNew = true;
    // } else {
    this.isEdit = this.router.url.includes('edit');
    this.vehicle = new Vehicle('', '', 0, 0, 0);
    this.initForm();
    let company = localStorage.getItem('company');
    this.rentACarService.getRentACar(company).subscribe(
      (response : any) => {
          let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), response);
          this.rentACar = toRentACar.ToRegular();
          this.vehicleTypes = this.rentACarService.getVehicleTypes();
          this.vehicleTypes.splice(0, 1);
          this.locations = this.rentACar.locations;
          this.subscribtion = this.activeRoute.params
          .subscribe(
            (params: Params) => {
              this.vehicleIndex = +params['idvh'];
              if (this.vehicleIndex === undefined || Number.isNaN(this.vehicleIndex)) {
                this.isEdit = false;
              } else {
                this.isEdit = true;
                this.vehicle = this.rentACar.vehicles[this.vehicleIndex];
                this.indexLocation = this.locations.indexOf(this.vehicle.location);
                this.indexType = this.vehicleTypes.indexOf(this.vehicle.type);
              }
          });
          this.initForm();
      },
      error => {
          console.log(error);
      }
    );
    // }
  }

  initForm() {
    this.addForm = new FormGroup({
      'brand': this.isEdit ? new FormControl(this.vehicle.brand, Validators.required) : new FormControl(null, Validators.required),
      'year': this.isEdit ? new FormControl(this.vehicle.year, Validators.required) : new FormControl(null, Validators.required),
      'type': this.isEdit ? new FormControl(this.vehicleTypes[this.indexType], Validators.required) : new FormControl(null, Validators.required),
      'seats': this.isEdit ? new FormControl(this.vehicle.numOfSeats, Validators.required) : new FormControl(null, Validators.required),
      'price': this.isEdit ? new FormControl(this.vehicle.pricePerDay, Validators.required) : new FormControl(null, Validators.required),
      'location': this.isEdit ? new FormControl(this.locations[this.indexLocation], Validators.required) : new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    if (!this.isEdit) {
      let vehicle = new Vehicle(
        this.addForm.value['brand'], 
        this.addForm.value['type'],
        this.addForm.value['seats'],
        this.addForm.value['year'],
        this.addForm.value['price'],
        this.addForm.value['location']
      );
      vehicle.rentACar = this.rentACar.name;

      this.vehicleService.postVehicle(vehicle).subscribe(
        (response: any) => {
          this._snackBar.open('Vehicle added successfully', 'OK', {
            duration: 5000,
          });
          this.rentACar.vehicles.push(vehicle);
          this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
          this.addForm.reset();
          this.router.navigate(['../'], {relativeTo: this.activeRoute});
        }, 
        error => {
          console.log(error);
        }
      );
    } else {
      this.vehicle.numOfSeats = this.addForm.value['seats'];
      this.vehicle.pricePerDay = this.addForm.value['price'];
      this.vehicle.location = this.addForm.value['location'];
      this.vehicleService.putVehicle(this.vehicle).subscribe(
        (response: any) => {
          if (response.success) {
            let index = -1;
            this.rentACar.vehicles.forEach(v => {
              if (v.vehicleId == this.vehicle.vehicleId) {
                index = this.rentACar.vehicles.indexOf(v);
              }
            });
            this.rentACar.vehicles[index] = this.vehicle;
            this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
            this._snackBar.open('Vehicle edited successfully', 'OK', {duration: 5000,});
            this.addForm.reset();
            this.router.navigate(['../../'], {relativeTo: this.activeRoute});
          } else {
            this._snackBar.open('Someone has made a reservation before the change/s could be saved', 'OK', {duration: 5000,});
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onCancel() {
    if (this.isEdit) {
      this.addForm.reset();
      this.router.navigate(['../../'], {relativeTo: this.activeRoute});
    } else {
      this.addForm.reset();
      this.router.navigate(['../'], {relativeTo: this.activeRoute});
    }
  }

  canExit(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.addForm.dirty){
      return confirm("All unsaved changes will be lost. Are you sure you want to leave this page?");
    }
    else{
      return true;
    }
  }

  ngOnDestroy() {
    if (!this.isNew) {
      this.subscribtion.unsubscribe();
    }
  }
}
