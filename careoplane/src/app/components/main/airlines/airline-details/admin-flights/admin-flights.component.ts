import { Component, OnInit, Input} from '@angular/core';
import { Airline } from 'src/app/models/airline.model';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { AirlineService } from 'src/app/services/airline.service';
import { startWith, map } from 'rxjs/operators';
import { Flight } from 'src/app/models/flight.model';

@Component({
  selector: 'app-admin-flights',
  templateUrl: './admin-flights.component.html',
  styleUrls: ['./admin-flights.component.css']
})
export class AdminFlightsComponent implements OnInit{
  @Input() back: string;
  @Input() admin: boolean;

  airline: Airline;
  origin: string;
  destination: string;
  departure: Date;
  sortBy: string = 'price';
  sortWay:boolean = false;
  classType: string;
  flights: Flight[] = [];

  cities: string[] = [];
  filteredOptionsOrigin: Observable<string[]> = new Observable<string[]>(); 
  filteredOptionsDestination: Observable<string[]> = new Observable<string[]>(); 
  
  minDateDep: Date = new Date();
  minDateRet: Date = new Date();

  filterForm: FormGroup;
  
  constructor(private airlineService: AirlineService) { }

  ngOnInit(): void {
    this.airline = new Airline();
    this.initForm();

    this.airlineService.airlineFlightList.subscribe(
      value => {
        this.airline = value;
        this.flights = this.airline.flights;

        for(let city of this.airline.destinations){
          if(!this.cities.includes(city.value)){
            this.cities.push(city.value);
          }
        }
      }
    )

    this.airlineService.flightListChange.subscribe(
      value => {
        let temp = [];
        for(let flight of this.flights){
          if(flight.id == value)
          {
            
          }
          else{
            temp.push(flight);
          }
        }
        this.flights = temp;
      }
    )

    this.filteredOptionsOrigin = this.filterForm.controls['origin'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredOptionsDestination = this.filterForm.controls['destination'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  initForm() {
    this.filterForm = new FormGroup({
      'origin': new FormControl(null),
      'destination': new FormControl(null),
      'departure': new FormControl(null),
      'classType': new FormControl('any'),
      'sortBy': new FormControl('price'),
      'sortWay': new FormControl(null),
    });

    this.filterForm.valueChanges.subscribe((values:any) => {
      this.origin = this.filterForm.controls['origin'].value;
      this.destination = this.filterForm.controls['destination'].value;
      this.departure = this.filterForm.controls['departure'].value;
      this.classType = this.filterForm.controls['classType'].value;
      this.sortBy = this.filterForm.controls['sortBy'].value;
      this.sortWay = this.filterForm.controls['sortWay'].value;

      this.minDateRet = this.departure;
      this.airlineService.updateClassType(this.classType);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.cities.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
