import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/models/vehicle.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() rentACar: RentACar;
  @Input() isAdmin: boolean = false;

  dataSource;
  displayedColumns: string[] = ['brand', 'year', 'type', 'seats', 'price', 'rating', 'details'];

  vehicleTypes = [];
  type: string = 'Any';
  pickUpLocations: string[] = [];
  returnToLocations: string[] = [];
  pickUpLocation: string = 'Any';
  returnToLocation: string = '';
  subscription: Subscription;
  searchPerformed = false;
  numOfDays = 1;
  discount = 0;

  minPickUpDate: Date = new Date();
  minReturnDate: Date = new Date();
  searchForm: FormGroup;
  pickUpDateFormControl: FormControl = new FormControl(null, Validators.required);
  returnDateFormControl: FormControl = new FormControl(null, Validators.required);

  length: number;
  currentPage = 0;
  pageSize = 4;
  pageSizeOptions: number[] = [4];
  pageEvent: PageEvent;

  vehicleListSubscription: Subscription;

  normalVehicles: Vehicle[];
  saleVehicles: Vehicle[];
  isShowingOnSale: boolean = false;

  constructor(
    private rentACarService: RentACarService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.rentACarService.getDiscountForVehicles().subscribe(
      (result: any) => {
        this.discount = result.discount;
      },
      error => {
        console.log(error);
      }
    );
    if (this.router.url.includes('profile')) { //Admin this.rentACar === undefined || this.rentACar.name === ''
      this.rentACarService.newVehicleListChanged.
      subscribe(
        (vehicles: Vehicle[]) => {
          this.manageVehicleLists(vehicles);
          //Provera da li treba da se prikazuju na snizenju ili obicna
          this.dataSource = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
          this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
        }
      );
      this.vehicleListSubscription = this.vehicleService.vehicleListChanged
      .subscribe(
        (vehicles: Vehicle[]) => {
          this.rentACar.vehicles = vehicles;
          this.manageVehicleLists(vehicles);
          //Provera da li treba da se prikazuju na snizenju ili obicna
          this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
          this.dataSource = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
          this.dataSource.paginator = this.paginator;
          // this.length = this.rentACar.vehicles.length;
          this.length = this.isShowingOnSale ? this.saleVehicles.length : this.normalVehicles.length;
          this.iterator();
        });
      this.rentACarService.onSaleClicked
        .subscribe(
        (isClicked: boolean) => {
          this.isShowingOnSale = isClicked;
          this.manageVehicleLists(this.rentACar.vehicles.slice());
          if (isClicked) {
            this.searchedVehicles = this.saleVehicles;
            this.dataSource = this.saleVehicles;
            this.length = this.saleVehicles.length;
          } else {
            this.searchedVehicles = this.normalVehicles;
            this.dataSource = this.normalVehicles;
            this.length = this.normalVehicles.length;
          }
          
          this.dataSource.paginator = this.paginator;
          // this.length = this.rentACar.vehicles.length;
         
          this.iterator();
        });

      this.rentACarService.vehicleSwaped
        .subscribe(
          (isSaleList: boolean) => {
            this.manageVehicleLists(this.rentACar.vehicles.slice());
          if (isSaleList) {
            this.searchedVehicles = this.saleVehicles;
            this.dataSource = this.saleVehicles;
            this.length = this.saleVehicles.length;
          } else {
            this.searchedVehicles = this.normalVehicles;
            this.dataSource = this.normalVehicles;
            this.length = this.normalVehicles.length;
          }
          
          this.dataSource.paginator = this.paginator;
          // this.length = this.rentACar.vehicles.length;
         
          this.iterator();
          }
        );
    } else { //Klijent
      this.rentACar = new RentACar('', '', '');
      this.pickUpLocations = [''];
      this.initForm();
      this.rentACarService.rentACarChanged.subscribe(
        response => {
          this.rentACar = response
          this.pickUpLocations = this.rentACar.locations.slice();
          if (this.pickUpLocations.length !== 1) {
            this.pickUpLocations.unshift('Any');
          }
          this.returnToLocations = this.rentACar.locations.slice();
          this.returnToLocation = this.returnToLocations[0];
          this.vehicleTypes = this.rentACarService.getVehicleTypes();
          this.initForm();
          // this.rentACar.locations.unshift('Any');
          this.vehicleListSubscription = this.vehicleService.vehicleListChanged
          .subscribe(
            (vehicles: Vehicle[]) => {
              this.manageVehicleLists(vehicles);
              //Provera da li treba da se prikazuju na snizenju ili obicna
              this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
              this.dataSource = this.isShowingOnSale ? this.saleVehicles : this.normalVehicles;
              this.dataSource.paginator = this.paginator;
              // this.length = this.rentACar.vehicles.length;
              this.length = this.isShowingOnSale ? this.saleVehicles.length : this.normalVehicles.length;
              this.iterator();
            }
          );
        }
      );

      this.rentACarService.reservationMade
        .subscribe(
          () => {
            this.onCancelSearch();
          }
        );

      this.subscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.vehicleTypes = this.rentACarService.getVehicleTypes();
          this.manageVehicleLists(this.rentACar.vehicles.slice());
          // this.searchedVehicles = this.rentACar.vehicles.slice();
          this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
          // this.dataSource = this.rentACar.vehicles.slice();
          this.dataSource = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
          this.dataSource.paginator = this.paginator;
          // this.length = this.rentACar.vehicles.length;
          this.length = this.isShowingOnSale ? this.saleVehicles.length : this.normalVehicles.length;
          this.iterator();

          this.rentACarService.onSaleClicked
          .subscribe(
          (isClicked: boolean) => {
          this.isShowingOnSale = isClicked;
          this.manageVehicleLists(this.rentACar.vehicles.slice());
          if (isClicked) {
            this.searchedVehicles = this.saleVehicles;
            this.dataSource = this.saleVehicles;
            this.length = this.saleVehicles.length;
          } else {
            this.searchedVehicles = this.normalVehicles;
            this.dataSource = this.normalVehicles;
            this.length = this.normalVehicles.length;
          }
          
          this.dataSource.paginator = this.paginator;
          // this.length = this.rentACar.vehicles.length;
         
          this.iterator();
          });
        }
      );

      this.manageVehicleLists(this.rentACar.vehicles.slice());
      // this.searchedVehicles = this.rentACar.vehicles.slice();
      this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
      // this.dataSource = this.rentACar.vehicles.slice();
      this.dataSource = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
      this.dataSource.sort = this.sort;
      // this.length = this.rentACar.vehicles.length;
      this.length = this.isShowingOnSale ? this.saleVehicles.length : this.normalVehicles.length;
      this.iterator();
    }
  }

  initForm() {
    this.searchForm = new FormGroup({
      'pickUpLocation': new FormControl(this.pickUpLocations[0]),
      'pickerPickUp': this.pickUpDateFormControl,
      'returnToLocation': new FormControl(this.returnToLocations[0]),
      'pickerReturn': this.returnDateFormControl,
      'type':  new FormControl(this.vehicleTypes[0]),
    });
    this.pickUpDateFormControl.valueChanges.subscribe(
      (newPickUpDate: Date) => {
        this.minReturnDate = newPickUpDate;
        if (this.returnDateFormControl.value === null)
          this.returnDateFormControl.setValue(newPickUpDate);
      }
    );
    this.returnDateFormControl.valueChanges.subscribe(
      (newReturnDate: Date) => {
        if (this.pickUpDateFormControl.value === null)
          this.pickUpDateFormControl.setValue(newReturnDate);
      }
    );
  }

  searchedVehicles: Vehicle[];

  onSearch() {
    if (!this.searchForm.valid) {
      return;
    }
    this.rentACarService.doNextOnReserve(this.searchForm.value['pickerPickUp'], this.searchForm.value['pickUpLocation'], this.searchForm.value['pickerReturn'], this.searchForm.value['returnToLocation']);
    this.searchPerformed = true;
    // const searchedVehicles: Vehicle[] = this.rentACar.vehicles.slice();
    // this.searchedVehicles = this.rentACar.vehicles.slice();
    this.searchedVehicles = this.normalVehicles.slice();
    let indexesToRemove: number[] = [];

    for (let vehicle of this.normalVehicles) { //this.rentACar.vehicles
      if (this.searchForm.value['pickUpLocation'] !== 'Any') {
        if (!vehicle.location.toLowerCase().includes(this.searchForm.value['pickUpLocation'].toLowerCase())) {
          indexesToRemove.push(this.searchedVehicles.indexOf(vehicle));
        }
      }

      if (this.searchForm.value['type'] !== 'Any') {
        if (!indexesToRemove.includes(this.searchedVehicles.indexOf(vehicle))) {
          if (!vehicle.type.toLowerCase().includes(this.searchForm.value['type'].toLowerCase())) {
            indexesToRemove.push(this.searchedVehicles.indexOf(vehicle));
          }
        }
      }

      if (this.searchForm.value['pickerPickUp'] !== null) {
        this.numOfDays = (this.searchForm.value['pickerReturn'] - this.searchForm.value['pickerPickUp'])  / 1000 / 60 / 60 / 24 + 1;
        if (!indexesToRemove.includes(this.searchedVehicles.indexOf(vehicle))) {
          let keep = true;
          for (let takenDate of vehicle.unavailableDates) {
            if (takenDate.valueOf() >= this.searchForm.value['pickerPickUp'].valueOf() && takenDate.valueOf() <= this.searchForm.value['pickerReturn'].valueOf()) {
              keep = false;
            }
          }
          if (!keep) {
            indexesToRemove.push(this.searchedVehicles.indexOf(vehicle));
          }
        }
      }
    }

    indexesToRemove.sort(function(a,b){ return b - a; });
    for (var i = 0; i <= indexesToRemove.length - 1; i++) {
      this.searchedVehicles.splice(indexesToRemove[i], 1);
    }
      
    this.dataSource = this.searchedVehicles;
    this.length = this.dataSource.length;
    this.iterator();
  }

  onCancelSearch() {
    this.searchPerformed = false;
    this.searchForm.patchValue({
      'pickUpLocation': this.pickUpLocations[0],
      'pickerPickUp': this.pickUpDateFormControl,
      'returnToLocation': this.returnToLocations[0],
      'pickerReturn': this.returnDateFormControl,
      'type': this.vehicleTypes[0]
    });
    this.minReturnDate = new Date();
    // this.searchedVehicles = this.rentACar.vehicles.slice();
    this.searchedVehicles = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
    this.searchForm.markAsPristine();
    // this.dataSource = this.rentACar.vehicles.slice();
    this.dataSource = this.isShowingOnSale ? this.saleVehicles.slice() : this.normalVehicles.slice();
    this.dataSource.paginator = this.paginator;
    // this.length = this.rentACar.vehicles.length;
    this.length = this.isShowingOnSale ? this.saleVehicles.length : this.normalVehicles.length;
    this.iterator();
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.searchedVehicles.slice(start, end);
    this.dataSource = part;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'price': return this.compare(a.pricePerDay * this.numOfDays + this.rentACar.pricelist[a.type], b.pricePerDay * this.numOfDays + this.rentACar.pricelist[b.type], isAsc);
        case 'year': return this.compare(a.year, b.year, isAsc);
        case 'seats': return this.compare(a.numOfSeats, b.numOfSeats, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a <= b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  manageVehicleLists(allVehicles: Vehicle[]) {
    this.normalVehicles = [];
    this.saleVehicles = [];
    for (let vehicle of allVehicles) {
      if (vehicle.isOnSale) {
        this.saleVehicles.push(vehicle);
      } else {
        this.normalVehicles.push(vehicle);
      }
    }
  }

  ngOnDestroy() {
    if (this.rentACar !== undefined) {
      // this.subscription.unsubscribe();
      // this.vehicleListSubscription.unsubscribe();
    }
  }

}
