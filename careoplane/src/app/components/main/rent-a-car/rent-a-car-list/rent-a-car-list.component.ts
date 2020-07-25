import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableFilter } from 'mat-table-filter';
import { Vehicle } from 'src/app/models/vehicle.model';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';

@Component({
  selector: 'app-rent-a-car-list',
  templateUrl: './rent-a-car-list.component.html',
  styleUrls: ['./rent-a-car-list.component.css']
})
export class RentACarListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  rentACars: RentACar[] = [];
  dataSource;
  displayedColumns: string[] = ['name', 'locations', 'rating', 'details'];
  subscription: Subscription;
  filteredName: string = '';
  filteredLocation: string = '';
  searchPerformed = false;

  minPickUpDate: Date = new Date();
  minReturnDate: Date = new Date();
  searchForm: FormGroup;
  pickUpDateFormControl: FormControl = new FormControl(null);
  returnDateFormControl: FormControl = new FormControl(null);

  length;
  currentPage = 0;
  pageSize = 7;
  pageSizeOptions: number[] = [3, 5, 7];
  pageEvent: PageEvent;

  constructor(
    private rentACarService: RentACarService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();
    this.subscription = this.rentACarService.rentACarsChanged
    .subscribe(
      (rentACars: RentACar[]) => {
        this.rentACars = rentACars;
        this.searchedRentACars = this.rentACars.slice();
        this.dataSource = rentACars.slice();
        this.dataSource.paginator = this.paginator;
        this.length = this.rentACars.length;
        this.iterator();
      }
    );

    this.rentACarService.getRentACars().subscribe(
      (response: TORentACar[]) => {
        response.forEach(element => {
          let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), element);
          this.rentACars.push(toRentACar.ToRegular());
        });
        
        this.rentACarService.rentACars = this.rentACars;
        // this.rentACars = response;
        this.searchedRentACars = this.rentACars.slice();
        this.dataSource = this.rentACars.slice();
        this.dataSource.sort = this.sort;
        this.length = this.rentACars.length;
      },
      error => {
        console.log(error);
      }
    );
  }

  initForm() {
    this.searchForm = new FormGroup({
      'name': new FormControl('Any'),
      'locations': new FormControl('Any'),
      'pickerPickUp': this.pickUpDateFormControl,
      'pickerReturn': this.returnDateFormControl,
    });
    this.pickUpDateFormControl.valueChanges.subscribe(
      (newPickUpDate: Date) => {
        this.minReturnDate = newPickUpDate;
        if (this.returnDateFormControl.value === null)
          this.returnDateFormControl.setValue(newPickUpDate);
      }
    );
  }

  searchedRentACars: RentACar[];

  onSearch() {
    this.searchPerformed = true;
    // const searchedRentACars: RentACar[] = this.rentACars.slice();
    this.searchedRentACars = this.rentACars.slice();
    let indexesToRemove: number[] = [];

    for (let rentACar of this.searchedRentACars) {
      if (this.searchForm.value['name'] !== 'Any' && this.searchForm.value['name'] !== '') {
        if (!rentACar.name.toLowerCase().includes(this.searchForm.value['name'].toLowerCase())) {
          indexesToRemove.push(this.searchedRentACars.indexOf(rentACar));
        }
      }

      if (this.searchForm.value['locations'] !== 'Any' && this.searchForm.value['locations'] !== '') {
        if (!indexesToRemove.includes(this.searchedRentACars.indexOf(rentACar))) {
          let keep = false;
          for (let location of rentACar.locations) {
            if (location.toLowerCase().includes(this.searchForm.value['locations'].toLowerCase())) {
              keep = true;
            }
          }
          if (!keep) {
            indexesToRemove.push(this.searchedRentACars.indexOf(rentACar));
          }
        }
      }

      if (this.searchForm.value['pickerPickUp'] !== null) {
        if (!indexesToRemove.includes(this.searchedRentACars.indexOf(rentACar))) {
          let keep = [];
          for (let vehicle of rentACar.vehicles) {
            for (let takenDate of vehicle.unavailableDates) {
              if (takenDate.getDate() >= this.searchForm.value['pickerPickUp'].getDate() && takenDate.getDate() <= this.searchForm.value['pickerReturn'].getDate()) {
                keep.push('.');
                break;
              }
            }
          }
          if (keep.length === rentACar.vehicles.length) {
            indexesToRemove.push(this.searchedRentACars.indexOf(rentACar));
          }
        }
      }
    }

    indexesToRemove.sort(function(a,b){ return b - a; });
    for (var i = 0; i <= indexesToRemove.length - 1; i++) {
      this.searchedRentACars.splice(indexesToRemove[i], 1);
    }
      
    this.dataSource = this.searchedRentACars;
    this.length = this.dataSource.length;
    this.iterator();
  }

  onCancelSearch() {
    this.searchForm.patchValue({
      'name': 'Any',
      'locations': 'Any',
      'pickerPickUp': null,
      'pickerReturn': null,
    });
    this.minReturnDate = new Date();
    this.searchedRentACars = this.rentACars.slice();
    this.searchForm.markAsPristine();
    this.searchPerformed = false;
    this.dataSource = this.rentACars.slice();
    this.dataSource.paginator = this.paginator;
    this.length = this.rentACars.length;
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
    const part = this.searchedRentACars.slice(start, end);
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
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a <= b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}
