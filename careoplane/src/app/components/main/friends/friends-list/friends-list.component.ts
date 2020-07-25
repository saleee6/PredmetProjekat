import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TOFriend } from 'src/app/t-o-models/t-o-friend.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {
  @Input() type = "";
  user: User = new User(null,null,null,null,null,null,null,null,[],null);
  friends: TOFriend[] = [];
  users: User[] = []
  text: string = null;

  constructor(private userService: UserService) { }
  ngOnInit(): void {
    if(this.type == "requests"){
      this.userService.requestUser.subscribe(
        result => {
          this.friends = result;
          this.userService.requestCount.next(this.friends.length);
        }
      )
    }

    if(this.type == "friends"){
      this.userService.friendsUser.subscribe(
        result => {
          this.friends = result;
        }
      )
    }

    if(this.type == "search"){
      this.userService.searchUser.subscribe(
        result => {
          this.users = result;
        } 
      )

      this.userService.sentUser.subscribe(
        result => {
          this.friends = result;
        } 
      )
    }
  }
}
