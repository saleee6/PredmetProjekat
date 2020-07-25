import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AirlineService } from 'src/app/services/airline.service';
import { Seat } from 'src/app/models/seat.model';
import { TOSeat } from 'src/app/t-o-models/t-o-seat.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seat-details',
  templateUrl: './seat-details.component.html',
  styleUrls: ['./seat-details.component.css']
})
export class SeatDetailsComponent implements OnInit {
  seatForm: FormGroup
  seat: Seat = new Seat();
  version: number;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router, 
    private airlineService: AirlineService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();

    this.activeRoute.params.subscribe(
      (params : Params) => {
        this.airlineService.getSeat(+params['id']).subscribe(
          result => {
            this.seat = Object.assign(new TOSeat(), result).convert();
            this.initForm();
          }
        )

        this.version = +params['version'];
      }
    )
  }

  initForm(){
    this.seatForm = new FormGroup({
      'name': new FormControl(this.seat.name),
      'category': new FormControl(this.seat.type),
      'price': new FormControl(this.seat.price),
      'discount': new FormControl(this.seat.discount, [Validators.required,Validators.min(0),Validators.max(100)])
    });


    this.seatForm.controls['name'].disable({onlySelf: true});
    this.seatForm.controls['category'].disable({onlySelf: true});
    this.seatForm.controls['price'].disable({onlySelf: true});
  }

  Cancel(check: number){
    if(check == -1){
      this.airlineService.ticketDoneChange(
        new Seat(-1)
      );
      this.seatForm.reset();
      this.router.navigate(['../../../../../'], {relativeTo: this.activeRoute});
    }
    else{
      this.airlineService.ticketDoneChange(null);
      this.seatForm.reset();
      this.router.navigate(['../../../'], {relativeTo: this.activeRoute});
    }
  }

  Change(){
    this.seat.discount = this.seatForm.controls['discount'].value;
    this.airlineService.changeSeat(this.seat, this.version).subscribe(
      (response: any) => {
        if(response.success){
          this.seatForm.reset();
          this.airlineService.ticketDoneChange(this.seat);
          this.router.navigate(['../../../'], {relativeTo: this.activeRoute});
        }
        else{
          this._snackBar.open('Something went wrong', 'OK', { duration: 5000, });
          this.Cancel(-1);
          //izmeni logiku da ponovo dobavi let
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  canExit(){
    if(this.seatForm.dirty){
      return confirm("Are you sure?");
    }
    else{
      return true;
    }
  }
}
