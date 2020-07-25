import { Component, OnInit, Input } from '@angular/core';
import { VehicleReservation } from 'src/app/models/vehicle-reservation.model';
import { AirlineService } from 'src/app/services/airline.service';
import { TOFlightReservation } from 'src/app/t-o-models/t-o-flight-reservation.model';
import { FlightReservation } from 'src/app/models/flight-reservation.model';

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent implements OnInit {
  @Input() reservation: any;
  fromDate: Date;
  toDate: Date;
  fromLocation: string;
  toLocation: string;
  arrow: string = "arrow_right_alt";

  constructor(private airlineService: AirlineService) { }

  ngOnInit(): void {
    if (this.reservation.type === 'vehicle') {
      this.fromDate = (<VehicleReservation>this.reservation).fromDate;
      this.toDate = (<VehicleReservation>this.reservation).toDate;
      this.fromLocation = (<VehicleReservation>this.reservation).fromLocation;
      this.toLocation = (<VehicleReservation>this.reservation).toLocation;
    }
     else 
    {
      let flight = (<FlightReservation>this.reservation).flightReservationDetails[0].flight;
      let flight2 = null;
      if((<FlightReservation>this.reservation).flightReservationDetails.length != 1){
        flight2 = (<FlightReservation>this.reservation).flightReservationDetails[1].flight;
        this.arrow = "swap_horiz"
      }
      this.fromDate = new Date(flight.departure);
      this.toDate = new Date(flight.arrival);
      if(flight2 != null){
        this.toDate = new Date(flight2.arrival);
      }
      this.fromLocation = flight.origin;
      this.toLocation = flight.destination;
    }
  }

}
