import { Component, OnInit, Input } from '@angular/core';
import { Airline } from 'src/app/models/airline.model';
import { AirlineService } from 'src/app/services/airline.service';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.css']
})
export class AirlineComponent implements OnInit {
  @Input() name: string;
  @Input() image: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.name)
    console.log(this.image)
  }

  public createImgPath = (serverPath: string) => {
    let s = `http://localhost:` + localStorage.getItem('port') + `/${this.image}`; 
    return s;
  }
}
