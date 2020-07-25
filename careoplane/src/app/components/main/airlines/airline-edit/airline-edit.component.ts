import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { Airline } from 'src/app/models/airline.model';
import { AirlineService } from 'src/app/services/airline.service';
import { ActivatedRoute, Params, Router, UrlTree } from '@angular/router';
import { GeoCodingServiceService } from 'src/app/services/geo-coding-service.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Admin } from 'src/app/models/admin.model';
import { UserService } from 'src/app/services/user.service';
import { TOPrimaryObject } from 'src/app/t-o-models/t-o-primary-object.model';
import { TOAirline } from 'src/app/t-o-models/t-o-airline.model';
import { PriceSegmentSeat } from 'src/app/models/price-segment-seat.model';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-airline-edit',
  templateUrl: './airline-edit.component.html',
  styleUrls: ['./airline-edit.component.css']
})
export class AirlineEditComponent implements OnInit {
  airline: Airline = new Airline();
  seats: FormArray = new FormArray([],this.checkArray.bind(this));
  edit: boolean = false;
  addressValid: boolean = false;
  group: FormGroup;
  visible = true;
  removable = true;
  addOnBlur = true;
  dirty = false;
  uploadedFile = null;
  isFirstLogIn: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private userService: UserService, 
    private activeRoute: ActivatedRoute, 
    private router: Router, 
    private airlineService: AirlineService,
    private geocoderService: GeoCodingServiceService,
    private logInDialog: MatDialog) { }

  ngOnInit(): void {
    this.formInit();

    if(this.router.url.includes('edit')){
      this.airlineService.getAirlineEdit(localStorage.getItem('company')).subscribe(
        result => {
          this.airline = Object.assign(new TOAirline(), result).convert();
          this.formInit();
        },
        error => {console.log(error);}
      );
      this.edit = true;
      this.addressValid = true;
    } else {
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

  formInit(){
    if(this.airline.name == null){
      this.group = new FormGroup({
        'name': new FormControl(this.airline.name, Validators.required),
        'address': new FormGroup({
          'street' : new FormControl(null,Validators.required),
          'city' : new FormControl(null,Validators.required),
          'country' : new FormControl(null,Validators.required)
        }),
        'description': new FormControl(this.airline.description,Validators.required),
        'priceFirstClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'priceBusinessClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'priceEconomyClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'rowsFirstClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'rowsBusinessClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'rowsEconomyClass': new FormControl(new PriceSegmentSeat(),Validators.required),
        'seats': this.seats
      });
    }
    else
    {
      for(let seat of this.airline.seatingArrangement){
        this.seats.push(new FormGroup({
          'seat': new FormControl(seat.value,Validators.required),
          'id' : new FormControl(seat.id)
        }))
      }

      this.group = new FormGroup({
        'name': new FormControl(this.airline.name, Validators.required),
        'address': new FormGroup({
          'street' : new FormControl(this.airline.address.split(',')[0],Validators.required),
          'city' : new FormControl(this.airline.address.split(',')[1],Validators.required),
          'country' : new FormControl(this.airline.address.split(',')[2],Validators.required)
        }),
        'description': new FormControl(this.airline.description,Validators.required),
        'priceFirstClass': new FormControl(this.airline.prices[0].value,Validators.required),
        'priceBusinessClass': new FormControl(this.airline.prices[1].value,Validators.required),
        'priceEconomyClass': new FormControl(this.airline.prices[2].value,Validators.required),
        'rowsFirstClass': new FormControl(this.airline.segments[0].value,Validators.required),
        'rowsBusinessClass': new FormControl(this.airline.segments[1].value,Validators.required),
        'rowsEconomyClass': new FormControl(this.airline.segments[2].value,Validators.required),
        'seats': this.seats
      });

      this.group.controls['name'].disable({onlySelf: true});
    }
    
    this.group.controls['address'].valueChanges.subscribe(value => {
      this.addressValid = false;
      this.dirty = true;
    });
  }

  verifyAddress(){
    this.geocoderService.checkAddress((<FormGroup>this.group.controls['address']).controls['street'].value + ',' +
      (<FormGroup>this.group.controls['address']).controls['city'].value + ',' +
      (<FormGroup>this.group.controls['address']).controls['country'].value).subscribe(
        result => {
          this.addressValid = result;
          this.dirty = false;
        }
      )
  }

  onSubmit()
  {
    if(this.edit && this.group.controls['address'].dirty){
      if(!this.addressValid){
        return;
      }
    }
    else{
      if(!this.edit){
        if(!this.addressValid){
          return;
        }
      }
    } 

    this.airline.name = this.group.controls['name'].value;
    this.airline.address = (<FormGroup>this.group.controls['address']).controls['street'].value + ',' +
                           (<FormGroup>this.group.controls['address']).controls['city'].value + ',' +
                           (<FormGroup>this.group.controls['address']).controls['country'].value;
    this.airline.description = this.group.controls['description'].value;
    let prices: PriceSegmentSeat[] = [];
    if(!this.edit){
      prices.push(new PriceSegmentSeat(0,this.group.controls['priceFirstClass'].value,0,this.airline.name));
      prices.push(new PriceSegmentSeat(0,this.group.controls['priceBusinessClass'].value,1,this.airline.name));
      prices.push(new PriceSegmentSeat(0,this.group.controls['priceEconomyClass'].value,2,this.airline.name));
    }
    else{
      prices.push(new PriceSegmentSeat(this.airline.prices[0].id,this.group.controls['priceFirstClass'].value,0,this.airline.name));
      prices.push(new PriceSegmentSeat(this.airline.prices[1].id,this.group.controls['priceBusinessClass'].value,1,this.airline.name));
      prices.push(new PriceSegmentSeat(this.airline.prices[2].id,this.group.controls['priceEconomyClass'].value,2,this.airline.name));
    }
    this.airline.prices = prices;

    let segments: PriceSegmentSeat[] = [];
    if(!this.edit){
      segments.push(new PriceSegmentSeat(0,this.group.controls['rowsFirstClass'].value,0,this.airline.name));
      segments.push(new PriceSegmentSeat(0,this.group.controls['rowsBusinessClass'].value,1,this.airline.name));
      segments.push(new PriceSegmentSeat(0,this.group.controls['rowsEconomyClass'].value,2,this.airline.name));
    }
    else{
      segments.push(new PriceSegmentSeat(this.airline.segments[0].id,this.group.controls['rowsFirstClass'].value,0,this.airline.name));
      segments.push(new PriceSegmentSeat(this.airline.segments[1].id,this.group.controls['rowsBusinessClass'].value,1,this.airline.name));
      segments.push(new PriceSegmentSeat(this.airline.segments[2].id,this.group.controls['rowsEconomyClass'].value,2,this.airline.name));
    }
    this.airline.segments = segments;
    this.airline.seatingArrangement = new Array<PriceSegmentSeat>();
    
    let counter = 0;
    for(let seat of this.seats.controls){
      this.airline.seatingArrangement.push(new PriceSegmentSeat(seat.value['id'],seat.value['seat'],counter,this.airline.name));
      counter++;
    }

    console.log(this.airline);
    if(!this.edit){
      this.airlineService.addAirline(this.airline)
      .subscribe(
        responseData => {
          this.userService.updateCompanyName(this.airline.name).subscribe(
            res => {
              localStorage.setItem('company',this.airline.name);

              const formData = new FormData();
              formData.append('file', this.uploadedFile, this.uploadedFile.name);
          
              this.airlineService.saveImage(formData).subscribe(
                result => {
                  let role = localStorage.getItem('role');
                  localStorage.setItem('role', role.substr(0, role.length-3));
                  this.group.reset();
                  this.uploadedFile = null;
                  this.router.navigate(['../../airline-profile'],{relativeTo : this.activeRoute});
                },
                error => {
                  console.log(error);
                }
              );
            },
            error => {
              console.log(error);
            }
          )
        },
        error => {
          console.log(error);
        }
      )
    }
    else{
      this.airlineService.editAirline(this.airline).subscribe(
        responseData => {
          if(this.uploadedFile != null){
            const formData = new FormData();
            formData.append('file', this.uploadedFile, this.uploadedFile.name);
        
            this.airlineService.saveImage(formData).subscribe(
              result => {
                this.group.reset();
                this.uploadedFile = null;
                this.router.navigate(['../../airline-profile'],{relativeTo : this.activeRoute});
              },
              error => {
                console.log(error);
              }
            );
          }
          else{
            this.group.reset();
            this.uploadedFile = null;
            this.router.navigate(['../../airline-profile'],{relativeTo : this.activeRoute});
          }
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  onAddSeat(){
    this.seats.push(
      new FormGroup({
        'seat': new FormControl(null, Validators.required),
        'id': new FormControl(0)
      }));
  }

  onDeleteSeat(i: number){
    this.seats.removeAt(i);
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;

    const from = event.previousIndex;
    const to = event.currentIndex;

    const temp = this.seats.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.seats.at(i + dir);
      this.seats.setControl(i, current);
    }
    this.seats.setControl(to, temp);
  }

  getList(){
    return (<FormArray>this.group.get('seats')).controls
  }

  checkArray(control: FormArray): {[s:string]:boolean}{
    if(control.length == 0){
      return {'can not be 0': true}
    }
    else{
      for(let item of control.controls){
        if(!item.value['seat'] || item.value['seat'] == null || item.value['seat'] <= 0){
          return {'can not be 0': true}
        }
      }
    }
    return null;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.airline.destinations.push(new TOPrimaryObject(0,value.trim(),this.airline.name));
    }

    if (input) {
      input.value = '';
    }
  }

  remove(destination: TOPrimaryObject): void {
    const index = this.airline.destinations.indexOf(destination);

    if (index >= 0) {
      this.airline.destinations.splice(index, 1);
    }
  }

  Cancel(){
    this.router.navigate(['../'],{relativeTo : this.activeRoute});
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    this.uploadedFile = <File>files[0];
  }

  canExit(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.group.dirty || this.uploadedFile != null){
      return confirm("All unsaved changes will be lost. Are you sure you want to leave this page?");
    }
    else{
      return true;
    }
  }

  checkStreet(){
    return (<FormGroup>this.group.controls['address']).controls['street'].hasError('required');
  }

  checkCity(){
    return (<FormGroup>this.group.controls['address']).controls['city'].hasError('required');
  }
  checkCountry(){
    return (<FormGroup>this.group.controls['address']).controls['country'].hasError('required');
  }
}
