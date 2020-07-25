import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  hide = true;
  usermail: string;
  password: string;
  socialProvider = "google";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {usermail: string, password: string},
    private dialogRef:MatDialogRef<LogInComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private OAuth: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // let socialPlatformProvider;  
  //   if (this.socialProvider === 'facebook') {  
  //     socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;  
  //   } else if (this.socialProvider === 'google') {  
  //     socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;  
  //   }

  initForm() {
    this.logInForm = new FormGroup({
      'usermail': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
    });
  }

  logInWithFB(): void {
    this.OAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialusers => {  
      console.log(socialusers);   
      this.userService.externalLogin(socialusers).subscribe((res:any)=>{
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'regular');
        localStorage.setItem('username',res.username);
        this.dialogRef.close('success');
      }); 
    });  
  }

  LoginWithGoogle(){
    this.OAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialusers => {  
      console.log(socialusers);   
      this.userService.externalLogin(socialusers).subscribe((res:any)=>{
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'regular');
        localStorage.setItem('username',res.username);
        this.dialogRef.close('success');
      }); 
    });  

  }

  onLogin() {
    this.userService.login(this.logInForm.value['usermail'], this.logInForm.value['password'])
    .subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        localStorage.setItem('is-first-log-in', res.isFirstLogIn);
        if (res.isFirstLogIn) {
          localStorage.setItem('tempPassword', this.logInForm.value['password']);
        }
        this.dialogRef.close('success');
      },
      err => {
        if (err.status == 400) {
          this._snackBar.open(err.error.message, 'OK', {duration: 5000,});
          this.logInForm.patchValue({
            usermail: '',
            password: ''
          });
          this.logInForm.markAsPristine();
          this.logInForm.markAsUntouched();
        }
        else
          console.log(err);
      }
    );
  }

}
