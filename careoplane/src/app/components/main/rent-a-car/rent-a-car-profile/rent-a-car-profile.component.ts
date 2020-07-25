import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin.model';
import { UserService } from 'src/app/services/user.service';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { RentACar } from 'src/app/models/rent-a-car.model';

@Component({
  selector: 'app-rent-a-car-profile',
  templateUrl: './rent-a-car-profile.component.html',
  styleUrls: ['./rent-a-car-profile.component.css']
})
export class RentACarProfileComponent implements OnInit {
  admin: Admin;
  rentACar: RentACar;

  constructor(
    private userService: UserService,
    private rentACarService: RentACarService
  ) { 
    // this.admin = this.userService.getMockUpRentACarAdmin();
  }

  ngOnInit(): void {
  }

}
