import { PriceSegmentSeat } from '../models/price-segment-seat.model';

export class TOPriceSegmentSeat {
    constructor(
        public id: number = 0,
        public value: number = 0,
        public ordinal: number = 0,
        public reference: string = null
        ){}

    public convert(): PriceSegmentSeat{
        let pSS = new PriceSegmentSeat();

        pSS.reference = this.reference;
        pSS.id = this.id;
        pSS.ordinal = this.ordinal;
        pSS.value = this.value;
        
        return pSS;
    }
}