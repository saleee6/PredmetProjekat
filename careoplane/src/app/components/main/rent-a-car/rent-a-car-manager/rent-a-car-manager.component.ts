import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { Vehicle } from 'src/app/models/vehicle.model';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Admin } from 'src/app/models/admin.model';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';
import { MatDialog } from '@angular/material/dialog';
import { LogInComponent } from 'src/app/components/log-in/log-in.component';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { GeoCodingServiceService } from 'src/app/services/geo-coding-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rent-a-car-manager',
  templateUrl: './rent-a-car-manager.component.html',
  styleUrls: ['./rent-a-car-manager.component.css']
})
export class RentACarManagerComponent implements OnInit {
  addForm: FormGroup;
  public locations: string[] = [];
  locationOfRentACar: string;
  displayedColumns = ['locations', 'delete']
  isEdit = false;
  rentACar: RentACar;
  isFirstLogIn = false;
  isValidAddress = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private userService: UserService,
    private rentACarService: RentACarService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private logInDialog: MatDialog,
    private geocoderService: GeoCodingServiceService
  ) { }

  ngOnInit(): void {
    if (this.router.url.includes('edit')) {
      this.isEdit = true;
      this.rentACar = new RentACar('', ',,,', '');
      this.initForm();
      let company = localStorage.getItem('company');
      this.rentACarService.getRentACar(company).subscribe(
        (response : any) => {
            let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), response);
            this.rentACar = toRentACar.ToRegular();
            this.locationOfRentACar = this.rentACar.address; //address, city, state
            this.initForm();
        },
        error => {
            console.log(error);
        });
      this.isValidAddress = true;
    } else {
      this.isEdit = false;
      this.isValidAddress = false;
      this.initForm();
      this.isFirstLogIn = localStorage.getItem('is-first-log-in') == 'true';
      if (this.isFirstLogIn) {
        let dialogRef = this.logInDialog.open(
          ChangePasswordComponent, {
            data: {password: '', confirmPassword: ''}
          }
        );
      }
    }
  }

  initForm() {
    this.addForm = new FormGroup({
      'name': this.isEdit ?  new FormControl({'value': this.rentACar.name, disabled: true}) : new FormControl(null, Validators.required),
      'address': this.isEdit ?  new FormControl(this.rentACar.address.split(',')[0], Validators.required) : new FormControl(null, Validators.required),
      'city': this.isEdit ?  new FormControl(this.rentACar.address.split(',')[1].substr(1), Validators.required) : new FormControl(null, Validators.required),
      'state': this.isEdit ?  new FormControl(this.rentACar.address.split(',')[2].substr(1), Validators.required) : new FormControl(null, Validators.required),
      'description': this.isEdit ?  new FormControl(this.rentACar.description, Validators.required) : new FormControl(null, Validators.required),
      'locations': this.isEdit ?  new FormControl(null) : new FormControl(null),
      'car': this.isEdit ?  new FormControl(this.rentACar.prices[0], Validators.required) : new FormControl(null, Validators.required),
      'van': this.isEdit ?  new FormControl(this.rentACar.prices[1], Validators.required) : new FormControl(null, Validators.required),
      'truck': this.isEdit ?  new FormControl(this.rentACar.prices[2], Validators.required) : new FormControl(null, Validators.required),
    });
    if (this.isEdit) {
      for (let location of this.rentACar.locations) {
        this.locations.push(location.trim());
      }
    }
  }

  onVerifyAddress() {
    this.locationOfRentACar = this.addForm.value['address'] + ', ' + this.addForm.value['city'] + ', ' + this.addForm.value['state'];
    this.geocoderService.checkAddress(this.locationOfRentACar).subscribe(
        result => {
          this.isValidAddress = result;
        }
      )
    this.locations.push(this.addForm.value['city'].trim());
  }

  onAddLocation(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.locations.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  onRemoveLocation(location: string) {
    this.locations.splice(this.locations.indexOf(location), 1);
  }

  onCancel() {
    this.addForm.reset();
    this.router.navigate(['main/rent-a-car-profile']);
  }

  onSubmit() {
    if (this.isEdit) {
      this.rentACar.address = this.locationOfRentACar;
      this.rentACar.description = this.addForm.value['description'];
      this.rentACar.prices[0] = this.addForm.value['car'];
      this.rentACar.prices[1] = this.addForm.value['van'];
      this.rentACar.prices[2] = this.addForm.value['truck'];
      this.rentACar.locations = this.locations;

      this.rentACarService.editRentACar(this.rentACar).subscribe(
        response => {
          this._snackBar.open('Information updated successfully', 'OK', {duration: 5000,});
          this.addForm.reset();
          this.router.navigate(['main/rent-a-car-profile']);
        },
        error => {});
    } else {
      let prices = [];
      prices.push(this.addForm.value['car']);
      prices.push(this.addForm.value['van']);
      prices.push(this.addForm.value['truck']);
      let rentACar = new RentACar(
        this.addForm.value['name'],
        this.locationOfRentACar,
        this.addForm.value['description'],
        [],
        this.locations,
        0,
        prices
      );

      this.rentACarService.addRentACar(rentACar).subscribe(
        response => {
          this.userService.updateCompanyName(response['name']).subscribe(
            (response: any) => {
              localStorage.setItem('company', response.company)
              let role = localStorage.getItem('role');
              localStorage.setItem('role', role.substr(0, role.length-3));
              this._snackBar.open('Rent a car service created successfully', 'OK', {duration: 5000,});
              this.addForm.reset();
              this.router.navigate(['main/rent-a-car-profile']);
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          console.log(error);
          this.addForm.patchValue({name: ''}); 
          this._snackBar.open('Rent a car service with that name already exists', 'OK', {duration: 5000,});
        }
      )
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
}
