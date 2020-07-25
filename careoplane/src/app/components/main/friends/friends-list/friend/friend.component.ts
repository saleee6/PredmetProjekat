import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { TOFriend } from 'src/app/t-o-models/t-o-friend.model';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  @Input() user: User = new User(null,null,null,null,null,null,null,null,[],null);
  @Input() friend: TOFriend = new TOFriend();
  @Input() type: string = "";

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if(this.type != 'search'){
      this.user = JSON.parse(localStorage.getItem('user'));
      if(this.friend.friendA.userName == this.user.userName){
        this.user = this.friend.friendB;
      }
      else{
        this.user = this.friend.friendA;
      }
    }
  }

  Add(){
    this.userService.MakeRequest(JSON.parse(localStorage.getItem('user')),this.user).subscribe(
      result =>{
        this.userService.peopleListChange(this.user,result);
      },
      error => {
        console.log(error);
      }
    )
  }

  Decline(){
    this.userService.DeclineRequest(this.friend.id).subscribe(
      result =>{
        this.userService.requestListChange(this.friend.id);
      },
      error => {
        
      }
    )
  }

  Accept(){
    this.userService.UpdateStatus(this.friend.id, "accepted").subscribe(
      result =>{
        this.userService.moveToFriends(this.friend.id);
      },
      error => {
        
      }
    )
  }

  Remove(){
    this.userService.DeclineRequest(this.friend.id).subscribe(
      result =>{
        this.userService.friendListChange(this.friend.id);
      },
      error => {
        
      }
    )    
  }

  Cancel(){
    this.userService.DeclineRequest(this.friend.id).subscribe(
      result =>{
        this.userService.sentListChange(this.friend.id);
      },
      error => {
        
      }
    )    
  }
}
