import { Component, OnInit, Input } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/models/vehicle.model';
import { TOVehicle } from 'src/app/t-o-models/t-o-vehicle.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';

@Component({
  selector: 'app-vehicle-sale-list',
  templateUrl: './vehicle-sale-list.component.html',
  styleUrls: ['./vehicle-sale-list.component.scss']
})
export class VehicleSaleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  discount = 0;
  numberOfDays: number = 0;
  showTable: boolean = false;
  showPicker: boolean = false;
  @Input() location: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() toDateMax: Date;

  constructor(
    private vehicleService: VehicleService,
    private rentACarService: RentACarService
  ) { }

  ngOnInit(): void {
    this.rentACarService.getDiscountForVehicles().subscribe(
      (result: any) => {
        this.discount = result.discount;
      },
      error => {
        console.log(error);
      }
    );

    this.SearchVehicles();
  }

  public OnDateChange(event): void {
    this.toDate = new Date((<Date>event).toDateString());
    this.SearchVehicles();
  }

  OnYes() {
    if (this.toDate == null) {
      this.showPicker = true;
    } else {
      this.SearchVehicles();
    }
  }

  SearchVehicles() {
    if (this.toDate == null) {
      return;
    }

    this.vehicles = [];
    this.vehicleService.getVehiclesOnSale(this.location, this.fromDate, this.toDate).subscribe(
      (response: TOVehicle[]) => {
        response.forEach(toVehicle => {
          let tempToVehicle = Object.assign(new TOVehicle('','',0,0,0,'',0,[],true,''), toVehicle);
          this.vehicles.push(tempToVehicle.ToRegular());
          this.numberOfDays = (this.toDate.setHours(0,0) - this.fromDate.setHours(0,0))  / 1000 / 60 / 60 / 24 + 1;
        })
        this.showTable = true;
      },
      error => {
        console.log(error);
      }
    );
  }

}
