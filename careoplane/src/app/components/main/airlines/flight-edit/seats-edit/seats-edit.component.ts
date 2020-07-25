import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Flight } from 'src/app/models/flight.model';
import { AirlineService } from 'src/app/services/airline.service';

@Component({
  selector: 'app-seats-edit',
  templateUrl: './seats-edit.component.html',
  styleUrls: ['./seats-edit.component.css']
})
export class SeatsEditComponent implements OnInit {
  flight: Flight;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private airlineServie: AirlineService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.airlineServie.getFlightDB(+params['fid']).subscribe(
        result => {
          this.flight = Object.assign(new Flight(),result);
          this.airlineServie.flightLoaded(this.flight);
        },
        error => {console.log(error);}
      )
    });
  }

  Back(){
    if(!this.activeRoute.params['id']){
      this.router.navigate(['../../'],{relativeTo: this.activeRoute});
    }
    else{
      this.router.navigate(['../../../../../'],{relativeTo: this.activeRoute});
    }
  }

}
