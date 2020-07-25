import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  user: User = new User("","","","","","","","",[],"",[],[]);
  role: string = "";
  requestCount = 0;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.requestCount.subscribe(
      count => {
        this.requestCount = count;
      }
    )

    this.userService.getUser().subscribe(
      (response: any) => {
        this.role = localStorage.getItem('role');
        this.user = Object.assign(new User(this.role, '', '', '', '', '', '', ''), response);
        localStorage.setItem('user',JSON.stringify(this.user));
        this.userService.gotUser(this.user);
      },
      error => {
        console.log(error);
      }
    );
  }

}
