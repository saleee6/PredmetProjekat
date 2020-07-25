import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogInComponent } from '../../log-in/log-in.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string;
  user;
  role: string;
  isLoggedIn = false;
  isRentACarAdmin = false;
  isAirlineAdmin = false;
  isNewAdmin = false;
  isSysAdmin = false;
  isFirstLogIn = false;

  constructor(
    private userService: UserService,
    private logInDialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.userService.getUser().subscribe(
        (response: any) => {
          this.role = localStorage.getItem('role');
          this.user = Object.assign
          (new User(this.role, '', '', '', '', '', '', ''), response);
          localStorage.setItem('user', JSON.stringify(this.user));
          localStorage.setItem('company', response['company']);
          this.isLoggedIn = true;
          this.checkLoggedInUser();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.role = null;
      //this.router.navigate(['/main']);
    }
  }

  onRegister() {
    this.router.navigate(['/user-authentification']);
  }

  onLogIn() {
    let dialogRef = this.logInDialog.open(
      LogInComponent, {
        data: {usermail: '', password: ''}
      }
    );

    dialogRef.afterClosed()
    .subscribe(
      (result) => {
        if (result === "success") {
          this.username = localStorage.getItem('username');
          this.role = localStorage.getItem('role');
          this.isFirstLogIn = localStorage.getItem('is-first-log-in') == 'True';
          // this.user = this.userService.getLoggedInUser();
          if (this.username === undefined) {
            return;
          }
          this.userService.getUser().subscribe(
            (response: any) => {
              this.user = Object.assign
              (new User(this.role, '', '', '', '', '', '', ''), response);
              localStorage.setItem('user', JSON.stringify(this.user));
              localStorage.setItem('company', response['company']);
              this.isLoggedIn = true;
              this.checkUser();
            },
            error => {
              console.log(error);
            }
          );
          
        }
    })
  }

  checkUser() {
    if (this.role === 'regular') {
      if (this.router.url.includes('user-authentification')) {
        this.router.navigate(['main']);
      }
    } else if (this.role === 'racAdmin') {
      this.isRentACarAdmin = true;
      this.router.navigate(['main/rent-a-car-profile']);
    } else if (this.role === 'racAdminNew') {
      this.isRentACarAdmin = true;
      this.isNewAdmin = true;
      this.router.navigate(['main/new-rent-a-car-profile']);
    } else if (this.role === 'aeroAdmin') {
      this.isAirlineAdmin = true;
      this.router.navigate(['main/airline-profile/details']);
    } else if (this.role === 'aeroAdminNew') {
      this.isAirlineAdmin = true;
      this.isNewAdmin = true;
      this.router.navigate(['main/airline-profile/new']);
    } else if (this.role === 'sysAdmin') {
      this.isSysAdmin = true;
      this.router.navigate(['main/add-admin']);
    }
  }

  checkLoggedInUser() {
    if (this.role === 'regular') {
    } else if (this.role === 'racAdmin') {
      this.isRentACarAdmin = true;
    } else if (this.role === 'racAdminNew') {
      this.isRentACarAdmin = true;
      this.isNewAdmin = true;
    } else if (this.role === 'aeroAdmin') {
      this.isAirlineAdmin = true;
    } else if (this.role === 'aeroAdminNew') {
      this.isAirlineAdmin = true;
      this.isNewAdmin = true;
    } else if (this.role === 'sysAdmin') {
      this.isSysAdmin = true;
    }
  }

  navigateHome(){
    if (this.role === 'regular') {
      this.router.navigate(['main']);
    } else if (this.role === 'racAdmin') {
      this.router.navigate(['main/rent-a-car-profile']);
    } else if (this.role === 'racAdminNew') {
      this.router.navigate(['main/new-rent-a-car-profile']);
    } else if (this.role === 'aeroAdmin') {
      this.router.navigate(['main/airline-profile/details']);
    } else if (this.role === 'aeroAdminNew') {
      this.router.navigate(['main/airline-profile/new']);
    } else if (this.role === 'sysAdmin') {
      this.router.navigate(['main/add-admin']);
    }
    else{
      this.router.navigate(['main']);
    }
  }

  onProfile() {
    this.router.navigate(['/main/user-profile']);
  }

  onFriends(){
    this.router.navigate(['/main/friends']);
  }

  showFriends() : boolean{
    if(localStorage.getItem('role') == 'regular')
      return true;
    else
      return false;
  }

  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('company');
    localStorage.removeItem('role');
    localStorage.removeItem('is-first-log-in');
    localStorage.removeItem('tempPassword');

    this.isLoggedIn = false;
    this.isAirlineAdmin = false;
    this.isRentACarAdmin = false;
    this.isNewAdmin = false;
    this.isSysAdmin = false;
    this.isFirstLogIn = false;
    this.role = null;
    
    this.router.navigate(['/main']);
  }

}
