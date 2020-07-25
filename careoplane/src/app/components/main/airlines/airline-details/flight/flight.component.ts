import { Component, OnInit, Input } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';
import { AirlineService } from 'src/app/services/airline.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FastTicket } from 'src/app/models/fast-ticket.model';
import { Airline } from 'src/app/models/airline.model';
import { TOAirline } from 'src/app/t-o-models/t-o-airline.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  @Input() flight: Flight = new Flight();
  @Input() fastTicket: FastTicket = null;
  @Input() back: string;
  @Input() admin:boolean;
  @Input() classType: string = 'any';
  @Input() roundTrip: boolean = false;
  @Input() passengers: number;
  backStr: string;
  price: any;
  seatsValid: boolean = false;
  constructor(public airlineService: AirlineService, 
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.checkSeats();
    
    if(this.back == 'one'){
        this.backStr = '../';
    }
    else{
      if(this.back == 'two'){
        this.backStr = '../../';
      }
      else{
        this.backStr = '../../../';
      }
    }

    if(this.fastTicket){
      this.flight = this.fastTicket.flight;
    }

    this.airlineService.classType.subscribe(newClass => {
      this.classType = newClass;

      if(this.classType === 'first'){
        this.price = this.flight.prices[0];
      }
      else{
        if(this.classType === 'business'){
          this.price = this.flight.prices[1];
        }
        else{
          this.price = this.flight.prices[2];
        }
      }
    });

    if(this.classType === 'first'){
      this.price = this.flight.prices[0].toString();
    }
    else{
      if(this.classType === 'business'){
        this.price = this.flight.prices[1].toString();
      }
      else{
        this.price = this.flight.prices[2].toString();
      }
    }
  }

  checkRole(){
    return localStorage.getItem('role');
  }

  //#region buttons
  Edit(){
    this.router.navigate(['../',this.flight.id,'edit-flight'],{relativeTo:this.activeRoute});
  }

  EditSeats(){
    this.router.navigate(['../',this.flight.id,'edit-seats'],{relativeTo:this.activeRoute});
  }

  Reserve(){
    this.router.navigate([this.backStr,'reservation'],{relativeTo:this.activeRoute, queryParams: {
      'flight1': this.flight.id,
      'passengers' : this.passengers,
      'classType' : this.classType 
    }});
  }

  FastReservation(){
    this.airlineService.changeFastTicket(this.fastTicket).subscribe(
      (response: any) => {
        if(response.success){
          this.airlineService.fastTicektListChanged(this.fastTicket.seat.seatId);
        }
        else{
          this._snackBar.open('Something went wrong', 'OK', { duration: 5000, });
          //dodati logiku da ponovo povuce fastTicket-e
        }
      },
      error => {console.log(error);}
    );
  }

  EditFastReservation(){
    let id = this.flight.seats.indexOf(this.fastTicket.seat);
    this.router.navigate(['../',this.fastTicket.seat.flightId,'edit-seats',this.fastTicket.seat.seatId,'seat'],{relativeTo:this.activeRoute});
  }

  DeleteFastReservation(){
    this.airlineService.deleteFastReservation(this.fastTicket.seat.seatId).subscribe(
      res => {
        this.airlineService.fastTicektListChanged(this.fastTicket.seat.seatId);
      },
      error => {
        console.log(error);
      }
    )
  }

  DeleteFlight(){
    this.airlineService.DeleteFlight(this.flight.id, this.flight.version).subscribe(
      (res: any) => {
        if(res.success){
          this.airlineService.flightListChanged(this.flight.id);
        }
        else{
          this._snackBar.open('Something went wrong', 'OK', { duration: 5000, });
          this.checkSeats();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  CheckDate(){
    return new Date(this.flight.departure).valueOf() > new Date().valueOf();
  }

  checkSeats(){
    this.airlineService.getSeats(this.flight.id).subscribe(
      (response : any) => {
        this.seatsValid = response.notFound;
      }
    )
  }
  //#endregion
}
