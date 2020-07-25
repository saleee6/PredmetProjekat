import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { RentACarService } from 'src/app/services/rent-a-car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { Vehicle } from 'src/app/models/vehicle.model';
import { RentACar } from 'src/app/models/rent-a-car.model';

@Component({
  selector: 'app-vehicle-tab-list',
  templateUrl: './vehicle-tab-list.component.html',
  styleUrls: ['./vehicle-tab-list.component.css']
})
export class VehicleTabListComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Input() rentACar: RentACar;
  @Input() dataSource: Vehicle[];
  
  displayedColumns: string[] = ['brand', 'year', 'type', 'seats', 'price', 'rating', 'details'];
  length;
  currentPage = 0;
  pageSize = 4;
  pageSizeOptions: number[] = [4];
  pageEvent: PageEvent;

  constructor(
    private rentACarService: RentACarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.slice(start, end);
    this.dataSource = part;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'price': return this.compare(a.pricePerDay + this.rentACar.pricelist[a.type], b.pricePerDay + this.rentACar.pricelist[b.type], isAsc);
        case 'year': return this.compare(a.year, b.year, isAsc);
        case 'seats': return this.compare(a.numOfSeats, b.numOfSeats, isAsc);
        case 'rating': return this.compare(a.rating, b.rating, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a <= b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
