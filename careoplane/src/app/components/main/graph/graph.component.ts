import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TOVehicleReservation } from 'src/app/t-o-models/t-o-vehicle-reservation.model';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart/public_api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AirlineService } from 'src/app/services/airline.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnDestroy {
  isRentACar: boolean;
  reservations: any[] = [];
  dateValue: any = '';
  earnings: number = 0;
  numberOfReservations: number = 0;
  reservationSubscription;
  vehicleSubscription;
  isSearched = false;
  profitText = '';
  datePickerValue: Date = null;

  graphTypes = ['Day', 'Week', 'Month'];
  type = '';
  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  minToDate: Date = new Date();
  searchForm: FormGroup;
  fromDateFormControl: FormControl = new FormControl(null, Validators.required);
  toDateFormControl: FormControl = new FormControl(null, Validators.required);

  constructor(
    private rentACarService: RentACarService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private airlineService: AirlineService
  ) { }

  sampleData: any[] = [];

  getWidth() : any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }
    return 850;
  }

  padding: any = { left: 5, top: 5, right: 5, bottom: 5 };

  titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  xAxis: any =
  {
      dataField: 'Time',
      description: 'Time', //this.type === 'Days' ? 'Hours': (this.type === 'Week' ? 'Weekdays' : 'Days')
      unitInterval: 1,
      tickMarks: { visible: true, interval: 1 },
      gridLinesInterval: { visible: true, interval: 1 },
      valuesOnTicks: false,
      padding: { bottom: 10 }
  };

  valueAxis: any =
    {
        unitInterval: 2,
        minValue: 0,
        maxValue: 20,
        title: { text: 'Number of reservations<br><br>' },
        labels: { horizontalAlignment: 'right' }
    };
  
  seriesGroups: any[] =
  [
      {
        type: 'line',
        series: [
            { 
              dataField: 'NumOfReservations',
              symbolType: 'square',
              labels:
              {
                  visible: true,
                  backgroundColor: '#FEFEFE',
                  backgroundOpacity: 0.2,
                  borderColor: '#7FC4EF',
                  borderOpacity: 0.7,
                  padding: { left: 5, right: 5, top: 0, bottom: 0 }
              }
            },
        ]
      }
  ];

  @ViewChild('myChart', { static: false }) myChart: jqxChartComponent;

  onTypeSelection() {
    switch (this.type) {
      case 'Day':
        this.xAxis.description = 'Hours';
        this.sampleData = [];
        for (let i = 0; i < 24; i++) {
          this.sampleData.push({
            Time: i.toString(), NumOfReservations: 0
          });
        }
        break;
      case 'Week':
        this.xAxis.description = 'Weekdays';
        this.sampleData = [];
        for (let i = 0; i < 7; i++) {
          this.sampleData.push({
            Time: this.weekdays[i], NumOfReservations: 0
          });
        }
        break;
      case 'Month':
        this.xAxis.description = 'Days';
        this.sampleData = [];
        for (let i = 1; i < 32; i++) {
          this.sampleData.push({
            Time: i.toString(), NumOfReservations: 0
          });
        }
        break;
    }
    this.myChart.update();
    this.OnDateChange(this.datePickerValue);
  }

  public OnDateChange(event): void {
    this.dateValue = (<Date>event).toDateString();
    let chosenDate: Date = new Date(this.dateValue);

    for (let i = 0; i < this.sampleData.length; i++) {
      this.sampleData[i].NumOfReservations = 0;
    }

    if (this.type == 'Week') {
      let dayNumber: number = chosenDate.getDay();
      dayNumber = dayNumber == 0 ? 6 : dayNumber - 1;
      this.sampleData[dayNumber].Time = chosenDate.toDateString();
      
      let date;
      let count = 1;
      for (let i = dayNumber - 1; i >= 0; i--) {
        date = new Date(chosenDate);
        date.setDate(chosenDate.getDate() - count++);
        this.sampleData[i].Time = date.toDateString();
      }

      count = 1;
      for (let i = dayNumber + 1; i <= 6; i++) {
        date = new Date(chosenDate);
        date.setDate(chosenDate.getDate() + count++);
        this.sampleData[i].Time = date.toDateString();
      }
    }

    if (this.type == 'Month') {
      this.sampleData = [];
        let daysInMonth = this.daysInMonth(chosenDate.getMonth() + 1, chosenDate.getFullYear());
        for (let i = 1; i <= daysInMonth; i++) {
          this.sampleData.push({
            Time: i.toString(), NumOfReservations: 0
          });
        }
    }
    
    this.reservations.forEach(reservation => {
      let creationDate: Date = new Date(reservation.creationDate);
      let index: number = 0;
      switch (this.type) {
        case 'Day':
          if (creationDate.getDate() == chosenDate.getDate() && creationDate.getMonth() == chosenDate.getMonth() && creationDate.getFullYear() == chosenDate.getFullYear()) {
            index = Number.parseInt(reservation.creationDate.split(' ')[1].split(':')[0]);
            if (reservation.creationDate.split(' ')[2] === 'PM') {
              if (index != 12) {
                index += 12;
              }
            } else if (index == 12) {
              index = 0;
            }
            this.sampleData[index].NumOfReservations++;
          }
          break;
        case 'Week':
          let leftDate: Date = new Date(this.sampleData[0].Time);
          let rightDate: Date = new Date(this.sampleData[6].Time);
          creationDate.setHours(0, 0, 0, 0);
          if (creationDate.valueOf() >= leftDate.valueOf() && creationDate.valueOf() <= rightDate.valueOf()) {
            index = creationDate.getDay();
            index = index == 0 ? 6 : index - 1;
            this.sampleData[index].NumOfReservations++;
          }
          break;
        case 'Month':
          if (creationDate.getMonth() === chosenDate.getMonth()) {
            index = creationDate.getDate();
            this.sampleData[index - 1].NumOfReservations++;
          }
          break;
      }
    })

    this.myChart.update();
  }

  daysInMonth (month, year): number { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
  }

  ngOnInit(): void {
    this.initForm();
    this.reservations = [];
    this.sampleData = [];

    this.isRentACar = localStorage.getItem('role').includes('rac') ? true : false;
    if (this.isRentACar) { //Rent a car servis
      this.vehicleSubscription = this.vehicleService.getVehiclesForCompany(localStorage.getItem('company')).subscribe(
        (response: number[]) => {
          let vehicleIds: number[] = response;
          this.reservationSubscription = this.vehicleService.getReservationsForVehicles(vehicleIds).subscribe(
            (response: TOVehicleReservation[]) => {
              response.forEach(vehicleReservation => 
                  this.reservations.push({
                    'price': vehicleReservation.price,
                    'creationDate': vehicleReservation.creationDate
                  }))
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          console.log(error);
        }
      );
    } else { //Avio kompanija
      let company = localStorage.getItem('company');
      this.reservationSubscription = this.airlineService.getCompanyReservations(company).subscribe(
        result => {
          for(let flightReservation of result){
            for(let flightDetails of flightReservation.flightReservationDetails){
              if(flightDetails.flight.airlineName == company){
                for(let passengerSeat of flightDetails.passengerSeats){
                  let price = passengerSeat.seat.price * (1 - (0.01 * passengerSeat.seat.discount)); 
                  this.reservations.push({
                    'price': price,
                    'creationDate': flightReservation.timeOfCreation
                  })
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
  }

  initForm() {
    this.searchForm = new FormGroup({
      'pickerFrom': this.fromDateFormControl,
      'pickerTo': this.toDateFormControl,
    });
    this.fromDateFormControl.valueChanges.subscribe(
      (newFromDate: Date) => {
        this.minToDate = newFromDate;
        if (this.toDateFormControl.value === null)
          this.toDateFormControl.setValue(newFromDate);
      }
    );
    this.toDateFormControl.valueChanges.subscribe(
      (newToDate: Date) => {
        if (this.fromDateFormControl.value === null)
          this.fromDateFormControl.setValue(newToDate);
      }
    );
  }

  onSearch() {
    this.isSearched = true;
    let earnings = 0;
    
    this.reservations.forEach(reservation => {
      let creationDate: Date = new Date(reservation.creationDate);
      creationDate.setHours(0, 0, 0, 0);
      let cdv = creationDate.valueOf();
      let fdv = this.searchForm.value['pickerFrom'].valueOf();
      let tdv = this.searchForm.value['pickerTo'].valueOf();
      if (creationDate.valueOf() >= this.searchForm.value['pickerFrom'].valueOf() && creationDate.valueOf() <= this.searchForm.value['pickerTo'].valueOf()) {
        earnings += reservation.price;
      }
    });
    this.profitText = 'Earnings for period ' + this.searchForm.value['pickerFrom'].toDateString() + ' - ' + this.searchForm.value['pickerTo'].toDateString() + ': ' + earnings.toString() + '€';
  }

  ngOnDestroy(): void {
    if(this.isRentACar)
      this.vehicleSubscription.unsubscribe();
    this.reservationSubscription.unsubscribe();
  }

}
