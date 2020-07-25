import { Component, OnInit, Input } from '@angular/core';
import { RentACar } from 'src/app/models/rent-a-car.model';

@Component({
  selector: 'app-rent-a-car-item',
  templateUrl: './rent-a-car-item.component.html',
  styleUrls: ['./rent-a-car-item.component.css']
})
export class RentACarItemComponent implements OnInit {
  @Input() rentACar: RentACar;
  @Input() index: number;

  constructor() { }

  ngOnInit(): void {
  }

}
