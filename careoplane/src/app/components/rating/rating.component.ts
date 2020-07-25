import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  public fullStar: string = 'star';
  public emptyStar: string = 'star_border';
  public star1;
  public star2;
  public star3;
  public star4;
  public star5;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {usermail: string, password: string},
  private dialogRef:MatDialogRef<RatingComponent>,) { }

  ngOnInit(): void {
    this.star1 = this.star2 = this.star3 = this.star4 = this.star5 = 'star_border';
  }

  hover(num: number){
    switch(num){
      case 1: {this.star1 = this.fullStar; this.star2 = this.emptyStar; this.star3 = this.emptyStar;
        this.star4 = this.emptyStar; this.star5 = this.emptyStar; break}
      case 2: {this.star1 = this.fullStar; this.star2 = this.fullStar; this.star3 = this.emptyStar;
        this.star4 = this.emptyStar; this.star5 = this.emptyStar; break}
      case 3: {this.star1 = this.fullStar; this.star2 = this.fullStar; this.star3 = this.fullStar;
        this.star4 = this.emptyStar; this.star5 = this.emptyStar; break}
      case 4: {this.star1 = this.fullStar; this.star2 = this.fullStar; this.star3 = this.fullStar;
        this.star4 = this.fullStar; this.star5 = this.emptyStar; break}
      case 5: {this.star1 = this.fullStar; this.star2 = this.fullStar; this.star3 = this.fullStar;
        this.star4 = this.fullStar; this.star5 = this.fullStar; break}
      default: {this.star1 = this.emptyStar; this.star2 = this.emptyStar; this.star3 = this.emptyStar;
        this.star4 = this.emptyStar; this.star5 = this.emptyStar; break}
    }
  }

  rate(num: number){
    switch(num){
      case 1: { this.dialogRef.close(1); break;}
      case 2: { this.dialogRef.close(2); break;}
      case 3: { this.dialogRef.close(3); break;}
      case 4: { this.dialogRef.close(4); break;}
      case 5: { this.dialogRef.close(5); break;}
    }
  }
}
