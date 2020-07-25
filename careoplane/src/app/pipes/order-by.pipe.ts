import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, field:string, reverse: boolean, bool1: boolean = false): any {
    if(value.length == 0 || !field || field == ''){
      return value;
    }

    let res = value.slice();

    if(!bool1 || field === "newPrice"){
      for(let i = 0; i < res.length; i++) {
        for(let j = 0; j < res.length - 1; j++) {
            if((res[j])[field] > (res[j + 1])[field]) {
                let swap = (res[j]);
                (res[j]) = (res[j + 1]);
                (res[j + 1]) = swap;
            }
        }
      }
    }
    else{
      for(let i = 0; i < res.length; i++) {
        for(let j = 0; j < res.length - 1; j++) {
            if((res[j]).seat[field] > (res[j + 1]).seat[field]) {
                let swap = (res[j]);
                (res[j]) = (res[j + 1]);
                (res[j + 1]) = swap;
            }
        }
      }
    }

    if(reverse){
      let reverseRes = [];
      for(let i = res.length-1;i >= 0; i--){
        reverseRes.push(res[i]);
      }
      return reverseRes;
    }
    else{
      return res;
    }
  }

}
