import { Pipe, PipeTransform } from '@angular/core';
import { Flight } from '../models/flight.model';

@Pipe({
  name: 'priceFilter'
})
export class PriceFilterPipe implements PipeTransform {

  transform(value: Flight[], filterNum: number, classType: string): any {
    if(!filterNum || value.length === 0){
      return value;
    }

    const res = [];

    for(const item of value){
      let counter = 0;
      for(const seat of item.seats){
        if(!seat.occupied && seat.discount == 0)
        {
          if(classType !== 'any' && seat.type === classType){
            counter++;
          }
          else{
            counter++;
          }
        }
      }
      if(counter >= filterNum){
        res.push(item);
      }
    }

    return res;
  }
}
