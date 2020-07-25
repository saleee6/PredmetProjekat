import { Component, OnInit, Input } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';
import { Airline } from 'src/app/models/airline.model';
import { AirlineService } from 'src/app/services/airline.service';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TOAirline } from 'src/app/t-o-models/t-o-airline.model';
import { TOFlight } from 'src/app/t-o-models/t-o-flight.model';

@Component({
  selector: 'app-seat-selector',
  templateUrl: './seat-selector.component.html',
  styleUrls: ['./seat-selector.component.scss']
})
export class SeatSelectorComponent implements OnInit {
  @Input() type:string = 'any';
  @Input() num: number;

  admin: boolean;
  flight: Flight;

  private seatConfig: any = null;
  seatmap = [];
  
  seatChartConfig = {
    showRowsLabel : true,
    showRowWisePricing : true,
    newSeatNoForRow : true
  }
  
  cart = {
    selectedSeats : [],
    seatstoStore : [],
    totalamount : 0,
    cartId : "",
    eventId : 0
  };

  rowLength: number;
  lastSeat: any = null;
  unselect: boolean = false;

  constructor(private airlineService: AirlineService,private router: Router, private activeRoute: ActivatedRoute){
  }

  ngOnInit(): void {
    if(localStorage.getItem('role') == "aeroAdmin"){
      this.admin = true;
    }
    else{
      this.admin = false;
    }

    if(this.num == 1){
      this.airlineService.flightSeatsEdit.subscribe(
        result => {
          this.flight = result;
  
          this.seatConfigFun();
          this.processSeatChart(this.seatConfig);
  
          if(this.router.url.includes('/seat')){
            for(let i = 0; i < this.seatmap.length;i++){
              for(let j = 0; j < this.seatmap[i].seats.length;j++){
                if(this.seatmap[i].seats[j].key === +this.router.url.split('/')[5]){
                  this.selectSeat(this.seatmap[i].seats[j]);
                }
              }
            }
          }
        },
        error => {
          console.log(error);
        }
      )
    }
    else{
      this.airlineService.flight2SeatsEdit.subscribe(
        result => {
          this.flight = result;
  
          this.seatConfigFun();
          this.processSeatChart(this.seatConfig);
  
          if(this.router.url.includes('/seat')){
            for(let i = 0; i < this.seatmap.length;i++){
              for(let j = 0; j < this.seatmap[i].seats.length;j++){
                if(this.seatmap[i].seats[j].key === +this.router.url.split('/')[5]){
                  this.selectSeat(this.seatmap[i].seats[j]);
                }
              }
            }
          }
        },
        error => {
          console.log(error);
        }
      )
    }
    
    if(this.num == 1){
      this.airlineService.emptyTickets.subscribe((tickets:any) => {
        while(tickets.selectedSeats.length != 0){
          for(let i = 0; i < this.seatmap.length;i++){
            for(let j = 0; j < this.seatmap[i].seats.length;j++){
              if(this.seatmap[i].seats[j].seatLabel === tickets.selectedSeats[0]){
                this.selectSeat(this.seatmap[i].seats[j]);
              }
            }
          }
        }
      });
    }
    else{
      this.airlineService.emptyTickets2.subscribe((tickets:any) => {
        while(tickets.selectedSeats.length != 0){
          for(let i = 0; i < this.seatmap.length;i++){
            for(let j = 0; j < this.seatmap[i].seats.length;j++){
              if(this.seatmap[i].seats[j].seatLabel === tickets.selectedSeats[0]){
                this.selectSeat(this.seatmap[i].seats[j]);
              }
            }
          }
        }
      });
    }
    
    this.airlineService.ticketDone.subscribe(value => {
      if(value != null && value.flightId != -1){
        this.flight.version = this.flight.version + 1;
        for(let seat of this.flight.seats){
          if(seat.name == value.name){
            seat.discount = value.discount;
          }
        }

        for(let seatRow of this.seatmap){
          for(let seat of seatRow.seats){
            seat.price = Math.round(value.price * (1 - (0.01 * value.discount)));
          }
        }
      }
      else{
        this.unselect = true;
        this.selectSeat(this.lastSeat);
      }
    })
  }

  private seatConfigFun(){
    this.seatConfig = [];
    let temp = [] as  any;
    let count = 1;
    let row:string = "";
    this.rowLength = 0;
    for(let k = 0;k < this.flight.seatingArangement.length;k++)
    {
      for(let q = 0;q < this.flight.seatingArangement[k].value;q++){
        row += "g";
        this.rowLength++;
      }
      if(k != this.flight.seatingArangement.length - 1){
        row +="_";
      }
    }
    
    for(let segment = 0; segment < this.flight.segments.length; segment++)
    {
      let price = this.flight.prices[segment];
      temp = [];
      for(let i = 0; i < this.flight.segments[segment].value;i++)
      {
          let tempObj = {
            "row_label": count.toString(),
            "layout": row
          }

          temp.push(tempObj);
          count++
      }
      let seatCon = {
        "segment_price": price,
        "segment_map": temp
      }

      this.seatConfig.push(seatCon);
    }
  }

  public processSeatChart ( map_data : any[] )
  {
      let start:number = 0;
      let classCounter: number = 0;
      let end: number = map_data.length;

      if(this.type === 'first'){
        end = 1;
      }
      else if(this.type === 'business'){
        start = 1;
        end = 2;
        classCounter = 1;
      }
      else if(this.type ==='economy'){
        start = 2;
        classCounter = 2;
      }

      let chars: string[] = ['','A','B','C','D','E','F','G','H','I','J'];
      let classes: string[] = ['First','Business','Economy'];
      
      if( map_data.length > 0 )
      {
        var seatNoCounter = 1;
        for (let __counter = start; __counter < end; __counter++) {
          var row_label = "";
          var item_map = map_data[__counter].segment_map;

          //Get the label name and price
          row_label = classes[classCounter];
          classCounter++;
          
          item_map.forEach(map_element => {
            var mapObj = {
              "seatRowLabel" : map_element.row_label,
              "seats" : [],
              "seatPricingInformation" : row_label
            };
            row_label = "";
            var seatValArr = map_element.layout.split('');
            if( this.seatChartConfig.newSeatNoForRow )
            {
              seatNoCounter = 1; //Reset the seat label counter for new row
            }
            var totalItemCounter = 1;
            seatValArr.forEach(item => {
              let status: string;
              for(let seat of this.flight.seats){
                if(seat.name == map_element.row_label+chars[seatNoCounter]){
                  if(seat.occupied || seat.discount != 0){
                    if(this.admin && seat.discount != 0){
                      if(seat.occupied){
                        status = 'unavailable';
                      }
                      else{
                        status = 'sale';
                      }
                    }
                    else{
                      status = 'unavailable';
                    }
                  }
                  else{
                      status = 'available';
                  }
                  
                  let tempPrice: string = Math.round(seat.price * (1 - (0.01 * seat.discount))).toString();

                  if( item != '_')
                    var seatObj = {
                      "key" : seat.seatId,
                      "price" : tempPrice,
                      "status" : status
                    };
                  else
                    var seatObj = {
                      "key" : 0,
                      "price" : "0",
                      "status" : status
                    };

                  if( item != '_')
                  {
                    seatObj["seatLabel"] = map_element.row_label+chars[seatNoCounter];
                    if(seatNoCounter < 10)
                    { seatObj["seatNo"] = chars[seatNoCounter]; }
                    else { seatObj["seatNo"] = ""+chars[seatNoCounter]; }
                    
                    seatNoCounter++;
                  }
                  else
                  {
                    seatObj["seatLabel"] = "";
                  }
                  totalItemCounter++;
                  mapObj["seats"].push(seatObj);
                  break;
                }
              }
            });
            this.seatmap.push( mapObj );
          });
        }

        
        // for (let __counter = 0; __counter < map_data.length; __counter++) {
        //   var row_label = "";
        //   var rowLblArr = map_data[__counter]["seat_labels"];
        //   var seatMapArr = map_data[__counter]["seat_map"];
        //   for (let rowIndex = 0; rowIndex < rowLblArr.length; rowIndex++) {
        //     var rowItem = rowLblArr[rowIndex];
        //     var mapObj = {
        //       "seatRowLabel" : rowItem,
        //       "seats" : []
        //     };
        //     var seatValArr = seatMapArr[rowIndex].split('');
        //     var seatNoCounter = 1;
        //     var totalItemCounter = 1;
        //     seatValArr.forEach(item => {
        //       var seatObj = {
        //         "key" : rowItem+"_"+totalItemCounter,
        //         "price" : map_data[__counter]["seat_price"],
        //         "status" : "available"
        //       };
               
        //       if( item != '_')
        //       {
        //         seatObj["seatLabel"] = rowItem+" "+seatNoCounter;
        //         if(seatNoCounter < 10)
        //         { seatObj["seatNo"] = "0"+seatNoCounter; }
        //         else { seatObj["seatNo"] = ""+seatNoCounter; }
                
        //         seatNoCounter++;
        //       }
        //       else
        //       {
        //         seatObj["seatLabel"] = "";
        //       }
        //       totalItemCounter++;
        //       mapObj["seats"].push(seatObj);
        //     });
        //     console.log(" \n\n\n Seat Objects " , mapObj);
        //     this.seatmap.push( mapObj );
        //     console.log(" \n\n\n Seat Map " , this.seatmap);
            
        //   }
                   
        // }
      }
  }

  public selectSeat( seatObject : any )
  {
    if(!this.admin){
      if(seatObject.status == "available")
      {
        seatObject.status = "booked";
        this.cart.selectedSeats.push(seatObject.seatLabel);
        this.cart.seatstoStore.push(seatObject.key);
        this.cart.totalamount += +seatObject.price;
      }
      else if( seatObject.status = "booked" )
      {
        seatObject.status = "available";
        var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
        if( seatIndex > -1)
        {
          this.cart.selectedSeats.splice(seatIndex , 1);
          this.cart.seatstoStore.splice(seatIndex , 1);
          this.cart.totalamount -= seatObject.price;
        }
      }
      if(this.num == 1)
        this.airlineService.ticketsChanged.next(this.cart);
      else
        this.airlineService.ticketsChanged2.next(this.cart);
    }
    else{
      if(seatObject.status == "available" || seatObject.status == "booked" || seatObject.status == "sale")
      {
        if(this.lastSeat){
          for(let seat of this.flight.seats){
            if(seat.name == this.lastSeat.seatLabel){
              if(seat.discount == 0){
                this.lastSeat.status = "available";
              }
              else{
                this.lastSeat.status = "sale";
              }
            }
          }
        }
        
        this.lastSeat = seatObject;
        
        if(!this.unselect){
          seatObject.status = "booked";
        }
        
        let id;
        for(let seat of this.flight.seats){
          if(seat.name == seatObject.seatLabel)
            id = seat.seatId;
        }

        this.router.navigate([id,this.flight.version,'seat'],{relativeTo:this.activeRoute});
        this.unselect = false;
      }
    }
  }
}