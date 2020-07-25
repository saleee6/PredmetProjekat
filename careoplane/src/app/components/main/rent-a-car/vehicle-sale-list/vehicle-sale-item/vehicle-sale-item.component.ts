import { Component, OnInit, Input } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
import { RentACar } from 'src/app/models/rent-a-car.model';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { TOVehicle } from 'src/app/t-o-models/t-o-vehicle.model';
import { TORentACar } from 'src/app/t-o-models/t-o-rent-a-car.model';
import { VehicleReservation } from 'src/app/models/vehicle-reservation.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-sale-item',
  templateUrl: './vehicle-sale-item.component.html',
  styleUrls: ['./vehicle-sale-item.component.scss']
})
export class VehicleSaleItemComponent implements OnInit {
  @Input() vehicle: Vehicle;
  @Input() discount: number;
  @Input() numberOfDays: number;
  @Input() location: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  rentACar: RentACar;
  price: number;

  constructor(
    private rentACarService: RentACarService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.rentACar = new RentACar('','','');

    this.rentACarService.getRentACar(this.vehicle.rentACar).subscribe(
      response => {
        let tempRentACar: TORentACar = Object.assign(new TORentACar('','',''), response);
        this.rentACar = tempRentACar.ToRegular();
        this.price = this.rentACar.pricelist[this.vehicle.type] + (this.vehicle.pricePerDay - (this.vehicle.pricePerDay*this.discount/100)) * this.numberOfDays;
      },
      error => {
        console.log(error);
      }
    );
  }

  OnCancel() {
    this.vehicleService.vehicleReservationCreated.next(null);
    this.vehicleService.vehicleRentACar.next(null);
    this.vehicleService.vehicleForReservation.next(null);
  }

  OnChoose() {
    let newVehicleReservation: VehicleReservation = new VehicleReservation(
      this.vehicle.vehicleId,
      this.fromDate,
      this.location,
      this.toDate,
      this.location,
      this.numberOfDays,
      this.price,
      new Date(),
      'double',
      false,
      false
    );

    this.vehicleService.vehicleReservationCreated.next(newVehicleReservation);
    this.vehicleService.vehicleRentACar.next(this.rentACar);
    this.vehicleService.vehicleForReservation.next(this.vehicle);
  }

}
