import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  @Input() reservationList;
  @Input() type;

  constructor() { }

  ngOnInit(): void {
  }

}
