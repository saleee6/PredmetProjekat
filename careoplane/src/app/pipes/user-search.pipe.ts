import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';
import { TOFriend } from '../t-o-models/t-o-friend.model';

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(value: any[], text: string, sent: boolean): any[] {
    if(!sent){
      let retList: User[] = [];

      if(text == null || text == ""){
        return value;
      }
  
      for(let user of value){
        let fullName = user.name + ' ' + user.surname;
        if(user.userName.toLowerCase().includes(text.toLowerCase()) 
          || fullName.toLowerCase().includes(text.toLowerCase())) 
        {
          retList.push(user);
        }
      }
  
      return retList;
    }
    else{
      let retList: TOFriend[] = [];

      if(text == null || text == ""){
        return value;
      }

      for(let friend of value){
        let fullName = friend.friendB.name + ' ' + friend.friendB.surname;
        if(friend.friendB.userName.toLowerCase().includes(text.toLowerCase()) 
          || fullName.toLowerCase().includes(text.toLowerCase())) 
        {
          retList.push(friend);
        }
      }

      return retList;
    }
  }

}
