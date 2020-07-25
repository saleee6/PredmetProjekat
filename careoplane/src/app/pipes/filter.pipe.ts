import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, propName: string, bool1: boolean = false): any {
    if(!bool1){
      if(!filterString){
        return value;
      }
      
      if (value.length === 0 || filterString === '') {
        return value;
      }
  
      const res = [];
  
      if (propName === 'locations') {
        for (const item of value) {
          for (const loc of item.locations) {
            if (loc.toLowerCase().includes(filterString.toLowerCase())) {
              res.push(item);
              break;
            }
          }
        }
      } else if (filterString === 'Any' && (propName === 'type' || propName === 'location')) {
        return value;
      } else {
        for (const item of value) {
          if (item[propName].toLowerCase().includes(filterString.toLowerCase())) {
            res.push(item);
          }
        }
      }
      return res;
    }
    else{
      if(!filterString){
        return value;
      }
      
      if (value.length === 0 || filterString === '') {
        return value;
      }
  
      const res = [];

      for (const item of value) {
        if(propName == 'type'){
          if(filterString ==='any'){
            res.push(item);
          }
          else{
            if (item.seat[propName].toLowerCase().includes(filterString.toLowerCase())) {
              res.push(item);
            }
          }
        }
        else{
          if (item.flight[propName].toLowerCase().includes(filterString.toLowerCase())) {
            res.push(item);
          }
        }
      }

      return res;
    }
  }

}
