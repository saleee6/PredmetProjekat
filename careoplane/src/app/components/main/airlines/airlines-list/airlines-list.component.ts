import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Airline } from 'src/app/models/airline.model';
import { AirlineService } from 'src/app/services/airline.service';
import { Subscription, Observable } from 'rxjs';
import { Flight } from 'src/app/models/flight.model';
import {map, startWith} from 'rxjs/operators';
import { TOFlight } from 'src/app/t-o-models/t-o-flight.model';
import { TOAirline } from 'src/app/t-o-models/t-o-airline.model';

@Component({
  selector: 'app-airlines-list',
  templateUrl: './airlines-list.component.html',
  styleUrls: ['./airlines-list.component.css']
})
export class AirlinesListComponent implements OnInit {
//#region  Lists
  airlines: Airline[] = [];
  flights: Flight[] = [];
  returnFlights: Flight[] = [];
  cities: string[] = [];
//#endregion

//#region Form
  typeControl: FormControl = new FormControl('one way', Validators.required);
  retControl: FormControl = new FormControl(null);
  departureControl: FormControl = new FormControl(null, Validators.required);
  toggleControl = new FormControl();
//#endregion

  @Input() singleAirline: boolean = false;
  airline: Airline = null;

  travelType:string='one way';
  exs: boolean = true;
  exf: boolean = false;

  origin: string;
  destination: string;
  type: string;
  departure: Date;
  ret: Date;
  num: number;
  showMessage: boolean = false;

  filteredOptionsOrigin: Observable<string[]>; 
  filteredOptionsDestination: Observable<string[]>; 
  
  minDateDep: Date = new Date();
  minDateRet: Date = new Date();

  searchForm: FormGroup;
  search: boolean = false;
  twoWay: boolean = false;
  returnFlight: boolean = false;

  airlineName: string;
  sortBy: string = 'price';
  sortWay:boolean = false;
  classType: string;
  
  constructor(private airlineService: AirlineService) { }

  ngOnInit(): void {
    this.initForm();
    
    if(!this.singleAirline){
      this.airlineService.getAirlinesDetailsDB().subscribe(
        result => {
          for(let airline of result){
            this.airlines.push(Object.assign(new TOAirline(),airline).convert());
            this.airlineService.images[airline.name] = airline.image;
  
            for(let airline of this.airlines){
              for(let city of airline.destinations){
                if(!this.cities.includes(city.value)){
                  this.cities.push(city.value);
                }
              }
            }
          }
        },
        error => {
          console.log();
        }
      )
    }
    else{
      this.airlineService.airlineFlightList.subscribe(
        (result:Airline) => {
          this.airline = result;
          for(let city of this.airline.destinations){
            if(!this.cities.includes(city.value)){
              this.cities.push(city.value);
            }
          }
        }
      )
    }

    this.filteredOptionsOrigin = this.searchForm.controls['origin'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredOptionsDestination = this.searchForm.controls['destination'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.cities.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private initForm() {
    let origin = '';
    let destination = '';
    let departure = null;
    let num = 1;
    
    this.searchForm = new FormGroup({
      'origin': new FormControl(origin, Validators.required),
      'destination': new FormControl(destination, Validators.required),
      'departure': this.departureControl,
      'ret': this.retControl,
      'num': new FormControl(num, [Validators.required, Validators.min(1)]),
      'type': this.typeControl,
      'classType': new FormControl('any')
    });

    this.typeControl.valueChanges.subscribe(type => {
      if (type==="round trip") {
        this.retControl.setValidators(Validators.required);
      } else {
        this.retControl.setValidators(null);
      }
      this.retControl.updateValueAndValidity();
    });

    this.departureControl.valueChanges.subscribe(newDate => {
      this.minDateRet = newDate;
    })
  }

  onSearch(){
    this.showMessage = true;
    this.airlineService.updateClassType(this.searchForm.value['classType']);
    this.classType = this.searchForm.value['classType'];
    this.origin = this.searchForm.value['origin'];
    this.destination = this.searchForm.value['destination'];
    this.num = this.searchForm.value['num'];

    if(this.travelType === "round trip"){
      this.twoWay = true;
    }
    else{
      this.twoWay = false;
    }

    this.exs = false;
    this.exf = true;
    
    let name = null;
    if(this.airline != null){
      name = this.airline.name;
    }

    let multi: string;
    if(this.travelType === "multi-city"){
      multi = 'true';
    }
    else{
      multi = 'false';
    }

    this.airlineService.getSearchedFlightsDB(
      this.searchForm.value['origin'],
      this.searchForm.value['destination'],
      this.searchForm.value['departure'],
      this.searchForm.value['num'],
      this.searchForm.value['classType'],
      name, multi).subscribe(
      result => {
        let newFlights = [];
        for(let flight of result){
          newFlights.push(Object.assign(new TOFlight(),flight).convert());
        }

        if(!this.twoWay){
          this.search = true;
          this.returnFlight = false;
          this.flights = newFlights;
        }
        else{
          let returnFlights;
          this.airlineService.getSearchedFlightsDB(
            this.searchForm.value['destination'],
            this.searchForm.value['origin'],
            this.searchForm.value['ret'],
            this.searchForm.value['num'],
            this.searchForm.value['classType'],
            name, 'false').subscribe(
              result => {
                let newRetFlights = [];
                for(let flight of result){
                  newRetFlights.push(Object.assign(new TOFlight(),flight).convert());
                }

                this.returnFlights = newRetFlights;
                this.flights = newFlights;
                this.returnFlight = true;
                this.search = false;
              },
              error => {
                console.log(error);
              }
          )
        }
      },
      error => {
        console.log();
      }
    )
  }

  onToggleChange() {
    this.sortWay = this.toggleControl.value;
  } 
  
}
