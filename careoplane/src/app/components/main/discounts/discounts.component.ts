import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/services/discount.service';
import { Discount } from 'src/app/models/discount.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {
  discounts: Discount[];
  discountsForm: FormGroup;
  isEdit = false;

  constructor(
    private discountService: DiscountService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.discounts = [new Discount(0, '', 0), new Discount(0, '', 0)];
    this.initForm();

    this.discountService.getDiscounts().subscribe(
      (response: Discount[]) => {
        this.discounts = response;
        this.initForm();
      },
      error => {
        console.log(error);
      }
    );
  }

  initForm() {
    this.discountsForm = new FormGroup({
      'discount1': new FormControl({'value': this.discounts[0].discountValue, disabled: true}, [Validators.required]),
      'discount2': new FormControl({'value': this.discounts[1].discountValue, disabled: true}, [Validators.required]),
    });
  }

  OnEdit() {
    this.isEdit = true;
    this.discountsForm.controls.discount1.enable();
    this.discountsForm.controls.discount2.enable();
  }

  OnCancel() {
    this.isEdit = false;
    this.discountsForm.patchValue({
      discount1: this.discounts[0].discountValue,
      discount2: this.discounts[1].discountValue,
    });
    this.discountsForm.controls.discount1.disable();
    this.discountsForm.controls.discount2.disable();
    this.discountsForm.markAsPristine();
  }

  OnSave() {
    let updatedDiscount1 = new Discount(
      this.discounts[0].discountId,
      this.discounts[0].type,
      this.discountsForm.value['discount1'],
    )

    let updatedDiscount2 = new Discount(
      this.discounts[1].discountId,
      this.discounts[1].type,
      this.discountsForm.value['discount2'],
    )

    this.discountService.putDiscount(updatedDiscount1).subscribe(
      response => {
        this.discountService.putDiscount(updatedDiscount2).subscribe(
          response => {
            this._snackBar.open('Changes have been successfully saved', 'OK', {duration: 5000,});
            this.discounts[0].discountValue = this.discountsForm.value['discount1'];
            this.discounts[1].discountValue = this.discountsForm.value['discount2'];
            this.OnCancel();
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
  }

  canExit(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.discountsForm.dirty){
      return confirm("All unsaved changes will be lost. Are you sure you want to leave this page?");
    }
    else{
      return true;
    }
  }

}
