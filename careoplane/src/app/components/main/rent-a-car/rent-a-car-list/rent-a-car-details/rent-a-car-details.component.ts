import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Inject } from '@angular/core';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin.model';
import { Vehicle } from 'src/app/models/vehicle.model';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { stringify } from 'querystring';
import { isNull } from 'util';
import { GeoCodingServiceService } from 'src/app/services/geo-coding-service.service';

@Component({
  selector: 'app-rent-a-car-details',
  templateUrl: './rent-a-car-details.component.html',
  styleUrls: ['./rent-a-car-details.component.css']
})
export class RentACarDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() admin: Admin;
  isAdmin: boolean = false;
  vehicleType = 'regular';
  isOnSaleClicked = false;

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  map: google.maps.Map;
  lat = 40.730610;
  lng = -73.935242;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 16,
  };
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });

  rentACar: RentACar;
  index: number;
  subscription: Subscription;
  vehicleListSubscription: Subscription;
  rentACarSubscription: Subscription;
  rentACars: RentACar[] = [];

  constructor(
    private rentACarService: RentACarService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private geolocationService: GeoCodingServiceService) { }

  ngOnInit(): void {
    this.rentACar = new RentACar('','','');
    // this.rentACarSubscription = this.rentACarService.rentACarChanged
    // .subscribe(
    //   (rentACar: RentACar) => {
    //     this.rentACar = rentACar;
    //   }
    // );
    // this.vehicleListSubscription = this.rentACarService.vehicleListChanged
    // .subscribe(
    //   (vehicles: Vehicle[]) => {
    //     this.rentACar.vehicles = vehicles;
    //   }
    // );
    this.subscription = this.route.params
    .subscribe(
      (params: Params) => {
        let company = localStorage.getItem('company');
        if (company === '' || isNull(company) || company === 'null') {
          if (this.router.url.includes('details/')) {
            let currentURL: string[] = this.router.url.split('/');
            let newURL = '/' + currentURL[1] + '/' + currentURL[2] + '/' + currentURL[3] + '/' + currentURL[4]; 
            this.router.navigateByUrl(newURL);
          }
          this.index = params['id'];
          this.rentACarService.getRentACars().subscribe(
            (response: TORentACar[]) => {
              response.forEach(element => {
                let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), element);
                this.rentACars.push(toRentACar.ToRegular());
              });
              
              this.rentACarService.rentACars = this.rentACars;
              this.rentACar = this.rentACars[this.index];
              this.rentACarService.locationLoaded(this.rentACar.address);
              this.rentACarService.rentACarChanged.next(this.rentACar);
              this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.isAdmin = true;
          this.rentACarService.getRentACar(company).subscribe(
            (response : any) => {
                let toRentACar: TORentACar = Object.assign(new TORentACar('', '', ''), response);
                this.rentACar = toRentACar.ToRegular();
                this.vehicleService.vehicleListChanged.next(this.rentACar.vehicles.slice());
                this.rentACarService.locationLoaded(this.rentACar.address);
            },
            error => {
                console.log(error);
            }
          );
        }
      }
    );
  }

  mapInitializer(address: string) {
    this.geolocationService.LatLon(address, this.map, this.gmap);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onAddVehicle() {
    this.router.navigate(['/main/rent-a-car-profile/add-vehicle']);
  }

  onSale() {
    this.isOnSaleClicked = !this.isOnSaleClicked;
    //this.router.navigate(['/main/rent-a-car-profile']);
    this.rentACarService.onSaleClicked.next(this.isOnSaleClicked);
  }

  ngAfterViewInit() {
    this.rentACarService.locationLoadedSubject.subscribe(
      result => {
        this.mapInitializer(result);
      }
    )
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // this.vehicleListSubscription.unsubscribe();
  }

}