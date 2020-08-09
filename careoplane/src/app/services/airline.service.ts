import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Airline } from '../models/airline.model';
import { Flight } from '../models/flight.model';
import { Seat } from '../models/seat.model';
import { FastTicket } from '../models/fast-ticket.model';
import { AirlineFastTicketsComponent } from '../components/main/airlines/airline-details/airline-fast-tickets/airline-fast-tickets.component';
import { FlightReservation } from '../models/flight-reservation.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TOPrimaryObject } from '../t-o-models/t-o-primary-object.model';
import { TOAirline } from '../t-o-models/t-o-airline.model';
import { TOFlight } from '../t-o-models/t-o-flight.model';
import { TOSeat } from '../t-o-models/t-o-seat.model';
import { TOFastTicket } from '../t-o-models/t-o-fast-ticket.model';
import { DatePipe } from '@angular/common';
import { TOPriceSegmentSeat } from '../t-o-models/t-o-price-segment-seat.model';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
  airlinesChanged = new Subject<Airline[]>()
  flightsChanged = new Subject<Flight[]>()
  ticketsChanged = new Subject<any>();
  ticketsChanged2 = new Subject<any>();
  emptyTickets = new Subject<any>();
  emptyTickets2 = new Subject<any>();
  classType = new Subject<string>();
  ticketDone = new Subject<Seat>();
  flightListChange = new Subject<number>();
  airlineFlightList = new Subject<Airline>();
  airlineFastTicketList = new Subject<Airline>();
  flightSeatsEdit = new Subject<Flight>();
  flight2SeatsEdit = new Subject<Flight>();
  flightChosenSeat = new Subject<Flight>();
  reservations: FlightReservation[] = [];
  locationLoaded = new Subject<string>();
  fastTicketListChange = new Subject<number>();
  images: { [airline : string] : string; } = {}

  public airlineLocation(location: string){
    this.locationLoaded.next(location);
  }

  public airlineLoaded(airline :Airline){
    this.airlineFlightList.next(airline);
    this.airlineFastTicketList.next(airline);
  }

  public flightLoaded(flight : Flight){
    this.flightSeatsEdit.next(flight);
  }

  public flightLoaded2(flight : Flight){
    this.flight2SeatsEdit.next(flight);
  }

  public ticketDoneChange(seat: Seat){
    this.ticketDone.next(seat);
  }

  public flightListChanged(id: number){
    this.flightListChange.next(id);
  }

  public fastTicektListChanged(id: number){
    this.fastTicketListChange.next(id);
  }

  public updateClassType(newClass: string){
    this.classType.next(newClass);
  }

  public updateTickes(tickets: any){
    this.ticketsChanged.next(tickets);
  }

  public resetTickets(tickets: any, tickets2: any){
    this.emptyTickets.next(tickets);
    this.emptyTickets2.next(tickets2);
  }
  
  constructor(private http: HttpClient, private datePipe: DatePipe) {
  }

  getAirlinesDetailsDB(){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Details';
    return this.http.get<TOAirline[]>(address);
  }

  getAirlineDisplay(name: string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Display/' + name;
    return this.http.get<TOAirline>(address);
  }

  getAirlineAdmin(name: string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Admin/' + name;
    return this.http.get<TOAirline>(address);
  }

  getDestinations(){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Destinations/' + localStorage.getItem('company');
    return this.http.get<TOPrimaryObject[]>(address);
  }

  getSearchedFlightsDB(origin: string, destination: string,  departure: Date, num: number, classType: string, name:string, multi:string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights/Searched';
    let notSingle = 'false';
    if(name == null)
      notSingle = 'true';

    var params = new HttpParams()
      .append('origin',origin)
      .append('destination',destination)
      .append('departure', new Date(departure).toDateString())
      .append('numPassengers',num.toString())
      .append('classType',classType)
      .append('name', name)
      .append('notSingleAirline', notSingle)
      .append('multi', multi);

    return this.http.get<TOFlight[]>(address, {params: params});
  }

  getAirlineEdit(name : string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Edit/' + name;
    return this.http.get<TOAirline>(address);
  }

  addAirline(airline: Airline) {
    let tempAirline = new TOAirline(airline.name,airline.address,airline.description,[],[],[],[],airline.picture,airline.rating,airline.destinations,[]);
    
    for(let variable of airline.prices){
      tempAirline.prices.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }

    for(let variable of airline.seatingArrangement){
      tempAirline.seatingArrangements.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }

    for(let variable of airline.segments){
      tempAirline.segmentLengths.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }
    
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines';
    return this.http.post(address,tempAirline);
  }

  editAirline(airline: Airline) {
    let tempAirline = new TOAirline(airline.name,airline.address,airline.description,[],[],[],[],airline.picture,airline.rating,airline.destinations,[]);

    for(let variable of airline.prices){
      tempAirline.prices.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }

    for(let variable of airline.seatingArrangement){
      tempAirline.seatingArrangements.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }

    for(let variable of airline.segments){
      tempAirline.segmentLengths.push(new TOPriceSegmentSeat(variable.id,variable.value,variable.ordinal,variable.reference));
    }

    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/' + tempAirline.name;
    return this.http.put(address,tempAirline);
  }

  getFlightDB(id: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights/' + id;
    return this.http.get<TOFlight>(address); 
  }

  EditFlight(flight: Flight) {
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights/' + flight.id.toString();
    let tempFlight = new TOFlight(flight.airlineName,flight.origin,flight.destination,
      /* this.datePipe.transform(flight.departure, 'dd.MM.yyyy HH:mm'),
      this.datePipe.transform(flight.arrival, 'dd.MM.yyyy HH:mm'), */
      new Date(flight.departure).toDateString(),
      new Date(flight.arrival).toDateString(),
      flight.distance,flight.connections,
      flight.id,[],[],[],[],flight.rating,flight.version);
    return this.http.put(address,tempFlight);
  }

  AddFlgiht(flight: Flight) {
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights';
    let tempFlight = new TOFlight(flight.airlineName,flight.origin,flight.destination,
      /* this.datePipe.transform(flight.departure, 'dd.MM.yyyy HH:mm'),
      this.datePipe.transform(flight.arrival, 'dd.MM.yyyy HH:mm'), */
      new Date(flight.departure).toDateString(),
      new Date(flight.arrival).toDateString(),
      flight.distance,flight.connections,
      flight.id,[],[],[],[],0,0);
    return this.http.post(address,tempFlight);
  }

  DeleteFlight(id: number, version: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights/' + id.toString() + '?version=' + version;
    return this.http.delete(address);
  }

  getSeat(id: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Seats/' + id;
    return this.http.get<TOSeat>(address);
  }

  changeSeat(seat: Seat, version: number) {
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Seats/' + 
    seat.seatId.toString() + "?version=" + version;
    let seatTemp = new TOSeat(seat.flightId,seat.name,seat.type,seat.occupied,seat.price,seat.discount,seat.seatId);
    return this.http.put(address,seatTemp);
  }

  changeFastTicket(fastTicket: FastTicket){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FastTickets/' + fastTicket.seat.seatId + '?version=' + fastTicket.flight.version;
    let tempFastTicket = new TOFastTicket(
      new TOSeat(fastTicket.seat.flightId,fastTicket.seat.name,fastTicket.seat.type,
        fastTicket.seat.occupied,fastTicket.seat.price,fastTicket.seat.discount,fastTicket.seat.seatId), 
        fastTicket.airlineName, fastTicket.newPrice);
    return this.http.put(address,{fastTicket: tempFastTicket, occupied: true});
  }

  deleteFastReservation(id: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FastTickets/' + id;
    return this.http.delete(address);
  }

  makeReservation(reservation: FlightReservation, usedPoints: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/' + usedPoints;
    return this.http.post(address,reservation);
  }

  getReservations() {
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations';
    return this.http.get<FlightReservation[]>(address);
  }

  getCompanyReservations(company: string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/Company/' + company;
    return this.http.get<FlightReservation[]>(address);
  }

  getReservation(id: number, username: string) {
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/Single';
    var params = new HttpParams()
      .append('id',id.toString())
      .append('username',username)
    return this.http.get<FlightReservation>(address, {params: params});
  }

  acceptInvitation(reservation: FlightReservation, tempUsername: string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/' + reservation.reservationId;
    let username = {
      'username': tempUsername
    };
    return this.http.put<FlightReservation>(address, username);
  }

  declineInvitation(reservation: FlightReservation, tempUsername: string){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/Cancel/' + reservation.reservationId;
    let username = {
      'username': tempUsername
    };
    return this.http.put<FlightReservation>(address, username);
  }

  rateFlight(rating: number,id: number, username: string, passengerSeatId: number, reservationId: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Flights/Rate';
    let params = {
      'id': id,
      'rating': rating,
      'username': username,
      'passengerSeatId': passengerSeatId,
      'reservationId' : reservationId
    };
    return this.http.put(address, params);
  }

  rateAirline(rating: number,id: string, username: string, passengerSeatId: number, reservationId: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Airlines/Rate';
    let params = {
      'id': id,
      'rating': rating,
      'username': username,
      'passengerSeatId': passengerSeatId,
      'reservationId' : reservationId
    };
    return this.http.put(address, params);
  }

  saveImage(formData, company: string){
    return this.http.post('http://localhost:' + localStorage.getItem('airlinePort') + '/api/Upload?company=' + company, formData);
  }

  getSeats(id: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/Seats/Flight/' + id;
    return this.http.get(address);
  }

  cancelReservation(id: number){
    let address ='http://localhost:' + localStorage.getItem('airlinePort') + '/api/FlightReservations/' + id;
    return this.http.delete(address);
  }
}
