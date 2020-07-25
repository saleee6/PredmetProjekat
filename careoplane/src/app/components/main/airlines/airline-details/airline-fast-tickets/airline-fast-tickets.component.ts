import { Component, OnInit, Input } from '@angular/core';
import { AirlineService } from 'src/app/services/airline.service';
import { ActivatedRoute } from '@angular/router';
import { Airline } from 'src/app/models/airline.model';
import { Seat } from 'src/app/models/seat.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FastTicket } from 'src/app/models/fast-ticket.model';

@Component({
  selector: 'app-airline-fast-tickets',
  templateUrl: './airline-fast-tickets.component.html',
  styleUrls: ['./airline-fast-tickets.component.css']
})
export class AirlineFastTicketsComponent implements OnInit {
  @Input() airline: Airline;
  @Input() back: string;
  @Input() admin: boolean;

  origin: string;
  destination: string;
  departure: Date;
  sortBy: string = 'newPrice';
  sortWay:boolean = false;
  classType: string;

  cities: string[] = [];
  filteredOptionsOrigin: Observable<string[]>; 
  filteredOptionsDestination: Observable<string[]>; 
  
  minDateDep: Date = new Date();
  minDateRet: Date = new Date();

  filterForm: FormGroup;
  
  constructor(private airlineService: AirlineService) { }

  ngOnInit(): void {
    this.airlineService.airlineFastTicketList.subscribe(
      value => {
        this.airline = value;

        for(let city of this.airline.destinations){
          if(!this.cities.includes(city.value)){
            this.cities.push(city.value);
          }
        }
      }
    )

    this.airlineService.fastTicketListChange.subscribe(
      result => {
        let fastTickets: FastTicket[] = [];
        for(let fastTicket of this.airline.fastTickets){
          if(fastTicket.seat.seatId != result){
            fastTickets.push(fastTicket);
          }
        }
        this.airline.fastTickets = fastTickets;
      }
    )

    this.initForm()

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
      'sortBy': new FormControl('newPrice'),
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

  checkDate(fastTicket: FastTicket){
    if(this.admin){
      return true;
    }
    return new Date(fastTicket.flight.departure).valueOf() > new Date().valueOf();
  }
}
