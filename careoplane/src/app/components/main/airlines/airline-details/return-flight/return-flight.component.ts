import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';
import { AirlineService } from 'src/app/services/airline.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-return-flight',
  templateUrl: './return-flight.component.html',
  styleUrls: ['./return-flight.component.css']
})
export class ReturnFlightComponent implements OnInit, OnDestroy {
  @Input() flight: Flight;
  @Input() returnFlights: Flight[];
  @Input() back: string;
  @Input() ret: Date;
  @Input() num: number;
  @Input() classType: string;
  @Input() admin: boolean;
  backStr: string;
  

  constructor(private airlineService: AirlineService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.back == 'one'){
        this.backStr = '../';
    }
    else{
      this.backStr = '../../';
    }
  }

  checkRole(){
    return localStorage.getItem('role');
  }

  ngOnDestroy(): void {
  }

  public Reserve(id1: number, id2: number){
    this.router.navigate([this.backStr,'reservation'],{relativeTo:this.activeRoute, queryParams: {
      'flight1': id1,
      'flight2': id2,
      'passengers' : this.num,
      'classType' : this.classType 
    }});
  }

  CheckDate(flight: Flight){
    return new Date(flight.departure).valueOf() > new Date().valueOf();
  }
}
