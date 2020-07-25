import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FlightReservation } from 'src/app/models/flight-reservation.model';
import { AirlineService } from 'src/app/services/airline.service';
import { VehicleReservation } from 'src/app/models/vehicle-reservation.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { TOVehicleReservation } from 'src/app/t-o-models/t-o-vehicle-reservation.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  loggedInUser: User;
  flightReservationsLoaded: boolean = false;
  flightReservations: FlightReservation[] = [];
  flightInvitations: FlightReservation[] = [];
  flightHistory: FlightReservation[] = [];

  vehicleReservationsLoaded: boolean = false;
  vehicleReservations: VehicleReservation[] = [];
  vehicleHistory: VehicleReservation[] = [];

  reservations: any[] = [];
  invitations: any[] = [];
  history: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private airlineService: AirlineService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser();

    this.airlineService.getReservations().subscribe(
      result => {
        for(let flightReservation of result){
          let flight2Exists = flightReservation.flightReservationDetails.length != 1 ? true : false;
          if(flight2Exists ? new Date(flightReservation.flightReservationDetails[1].flight.arrival).valueOf() < new Date().valueOf() :
          new Date(flightReservation.flightReservationDetails[0].flight.arrival).valueOf() < new Date().valueOf()){
            if(!this.checkReservations(flightReservation.reservationId,this.flightHistory)){
              this.flightHistory.push(flightReservation);
              this.history.push(flightReservation);
            }
          }
          else{
            if(flightReservation.creator == localStorage.getItem('username')){
              this.reservations.push(flightReservation)
              continue;
            }
            for(let flightDetails of flightReservation.flightReservationDetails){
              for(let passengerSeat of flightDetails.passengerSeats){
                if(passengerSeat.username == localStorage.getItem('username')){
                  if(passengerSeat.accepted){
                    if(!this.checkReservations(flightReservation.reservationId,this.flightReservations))
                    {
                      this.flightReservations.push(flightReservation);
                      this.reservations.push(flightReservation)
                    }
                  }
                  else{
                    if(!this.checkReservations(flightReservation.reservationId,this.flightInvitations))
                    {
                      this.flightInvitations.push(flightReservation);
                      this.invitations.push(flightReservation);
                    }  
                  }
                }
              }
            }
          }
        }
        this.flightReservationsLoaded = true;
      },
      error => {
        console.log(error);
      }
    );

    this.vehicleService.getVehiclesForUser().subscribe(
      (response: TOVehicleReservation[]) => {
        response.forEach(vehicleReservation => {
          let reservation: VehicleReservation = 
            Object.assign(new VehicleReservation(
              vehicleReservation.vehicleId, new Date(vehicleReservation.fromDate), 
              vehicleReservation.fromLocation, new Date(vehicleReservation.toDate), 
              vehicleReservation.toLocation, vehicleReservation.numOfDays, 
              vehicleReservation.price, new Date(vehicleReservation.creationDate), 
              vehicleReservation.type, vehicleReservation.isVehicleRated,
              vehicleReservation.isRentACarRated), vehicleReservation);

          if (new Date(vehicleReservation.toDate).valueOf() < (new Date()).valueOf()) { // Prosla rezervacija
            this.vehicleHistory.push(reservation);
            this.history.push(reservation);
          } else {
            this.vehicleReservations.push(reservation);
            this.reservations.push(reservation);
          }
        });
        this.vehicleReservationsLoaded = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  checkReservations(id: number, reservations: FlightReservation[]){
    for(let reservation of reservations){
      if(id == reservation.reservationId)
        return true;
    }
    return false;
  }
}
