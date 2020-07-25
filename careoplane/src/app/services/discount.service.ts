import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Discount } from '../models/discount.model';

@Injectable({
    providedIn: 'root'
})
export class DiscountService {
    constructor(
        private http: HttpClient
    ) {}

    getDiscounts() {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Discounts';
        return this.http
        .get(
            address
        );
    }

    putDiscount(updatedDiscount: Discount) {
        let address = 'http://localhost:' + localStorage.getItem('port') + '/api/Discounts/' + updatedDiscount.discountId;
        return this.http
        .put(
            address,
            updatedDiscount
        );
    }
}