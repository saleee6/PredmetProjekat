import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
/// <reference types=”@types/googlemaps” />

import { Airline } from 'src/app/models/airline.model';
import { AirlineService } from 'src/app/services/airline.service';
import { Subscription, Observable } from 'rxjs';
import { GeoCodingServiceService } from 'src/app/services/geo-coding-service.service';
import { UserService } from 'src/app/services/user.service';
import { Admin } from 'src/app/models/admin.model';
import { TOAirline } from 'src/app/t-o-models/t-o-airline.model';

@Component({
  selector: 'app-airline-details',
  templateUrl: './airline-details.component.html',
  styleUrls: ['./airline-details.component.css']
})
export class AirlineDetailsComponent implements OnInit, AfterViewInit{
  name: string;
  admin: boolean = false;
  
  airline: Airline;
  paramsSub: Subscription;

  origin: string = '';
  destination: string = '';
  departure: Date;
  arrival : Date;
  connections : number;
  price : number;
  showImage: boolean = false;

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions;
  marker: google.maps.Marker;

  constructor(private userService: UserService, private geocodingService: GeoCodingServiceService,private router: Router,private activeRoute: ActivatedRoute, private airlineService: AirlineService) { }

  ngOnInit(): void {
    this.airline = new Airline();
    this.activeRoute.params.subscribe(
      (params: Params) => {
          if(params['id']){
            this.name = params['id'];
            this.airlineService.getAirlineDisplay(this.name).subscribe(
              result => {
                this.airline = Object.assign(new TOAirline(), result).convert();
                this.showImage = true;
                this.airlineService.airlineLoaded(this.airline);
                this.airlineService.airlineLocation(this.airline.address);
              },
              error => {console.log(error);}
            );
          }
          else{
            this.name = localStorage.getItem('company');
            this.admin = true;
            this.airlineService.getAirlineDisplay(this.name).subscribe(
            result => {
              this.airline = Object.assign(new TOAirline(), result).convert();
              this.showImage = true;
              this.airlineService.airlineLoaded(this.airline);
              this.airlineService.airlineLocation(this.airline.address);
            },
            error => {console.log(error);}
          );
        }
      }
    );
  }

  ngAfterViewInit(){
    this.airlineService.locationLoaded.subscribe(
      result => {
        this.mapInitializer(result);
      }
    )
  }

  mapInitializer(address: string) {
    this.geocodingService.LatLon(address, this.map, this.gmap);
  }

  ngOnDestroy(): void {
  }

  onEdit(): void{
    this.router.navigate(['../edit'], { relativeTo: this.activeRoute });
  }

  AddFlight(){
    this.router.navigate(['../add-flight'], { relativeTo: this.activeRoute });
  }

  Back(){
    this.router.navigate(['../../','list'], { relativeTo: this.activeRoute }); 
  }

  public createImgPath = (serverPath: string) => {
    let s = `http://localhost:` + localStorage.getItem('airlinePort') + `/${this.airline.picture}`; 
    return s;
  }
}
