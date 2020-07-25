import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';
import { Observable } from 'rxjs';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-authentification',
  templateUrl: './user-authentification.component.html',
  styleUrls: ['./user-authentification.component.css']
})
export class UserAuthentificationComponent implements OnInit {
  registerForm: FormGroup;
  addForm: FormGroup;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  confirmPassword: string;
  confirmPasswordFormControl = new FormControl(null, [Validators.required]); //, this.comparePasswords.bind(this)

  isFirstLogIn = false;
  isProfile = false;
  isEdit = false;
  loggedInUser: User;
  isChangePassword = false;
  isAdmin = false;
  isAddAdmin = false;
  adminType: string[] = ['Airline Admin', 'Rent A Car Admin', 'System Admin'];

  role: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private logInDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = new User('', '', '', '', '', '', '', '');
    // this.userService.loggedInUserChanged.subscribe(
    //   (user: User) => {
    //     this.loggedInUser = user;
    //   }
    // );
    if (this.router.url.includes('main') && !this.router.url.includes('add-admin')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('user'));
      this.role = localStorage.getItem('role');
      this.isProfile = true;
      this.isAdmin = this.role.includes('dmin') ? true : false;
      
      // this.userService.getUser().subscribe(
      //   (response: any) => {
      //     this.role = localStorage.getItem('role');
      //     this.loggedInUser = Object.assign
      //     (new User(this.role, '', '', '', '', '', '', ''), response);
      //     this.isProfile = true;
      //     this.isAdmin = this.role.includes('dmin') ? true : false;
      //     this.initForm();
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // );
    } else if (this.router.url.includes('add-admin'))
    {
      this.isAddAdmin = true;
    } else {
      this.isChangePassword = true;
    }

    this.initForm();
  }

  initForm() {
    if (this.isAddAdmin) {
      this.isFirstLogIn = localStorage.getItem('is-first-log-in') == 'true';
      if (this.isFirstLogIn) {
        let dialogRef = this.logInDialog.open(
          ChangePasswordComponent, {
            data: {password: '', confirmPassword: ''}
          }
        );
      }
      this.addForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'type':  new FormControl(this.adminType[0]),
      });
    } else {
      this.registerForm = new FormGroup({
        'username': this.isProfile ? new FormControl({'value': this.loggedInUser.userName, disabled: !this.isEdit}) : new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]),
        'email': this.isProfile ? new FormControl({'value': this.loggedInUser.email, disabled: !this.isEdit}, [Validators.required, Validators.email]) : new FormControl(null, [Validators.required, Validators.email]),
        'password': this.isProfile ? new FormControl({'value': null, disabled: !this.isEdit}, this.isChangePassword ? Validators.required : null) : new FormControl(null, [Validators.required]),
        'confirmPassword': this.isProfile ? new FormControl({'value': null, disabled: !this.isEdit}, this.isChangePassword ? Validators.required : null) : this.confirmPasswordFormControl,
        'oldPassword': this.isProfile ? new FormControl({'value': null, disabled: !this.isEdit}, this.isChangePassword ? Validators.required : null) : new FormControl(null),
        'name': this.isProfile ? new FormControl({'value': this.loggedInUser.name, disabled: !this.isEdit}, [Validators.required]) : new FormControl(null, [Validators.required]),
        'surname': this.isProfile ? new FormControl({'value': this.loggedInUser.surname, disabled: !this.isEdit}, [Validators.required]) : new FormControl(null, [Validators.required]),
        'city': this.isProfile ? new FormControl({'value': this.loggedInUser.city, disabled: !this.isEdit}, [Validators.required]) :  new FormControl(null, [Validators.required]),
        'phone': this.isProfile ? new FormControl({'value': this.loggedInUser.phoneNumber, disabled: !this.isEdit}, [Validators.required, Validators.minLength(6), Validators.pattern('[+]?[0-9]+')]) : new FormControl(null, [Validators.required, , Validators.minLength(6), Validators.pattern('[+]?[0-9]+')]),
      }, 
      {validators: ConfirmPasswordValidator.MatchPassword});
  
      this.confirmPasswordFormControl.valueChanges
      .subscribe(
        (data: string) => {
          this.confirmPassword = data;
        }
      );
    }
  }

  onEdit() {
    this.isEdit = true;
    this.registerForm.controls.oldPassword.enable();
    this.registerForm.controls.password.enable();
    this.registerForm.controls.confirmPassword.enable();
    this.registerForm.controls.name.enable();
    this.registerForm.controls.surname.enable();
    this.registerForm.controls.city.enable();
    this.registerForm.controls.phone.enable();
  }

  onAdd() {
    if (!this.addForm.valid) {
      return;
    }

    let role = '';
    switch (this.addForm.value['type']) {
      case 'Airline Admin':
        role = 'aeroAdminNew'; 
        break;
      case 'Rent A Car Admin':
        role = 'racAdminNew'; 
        break;
      case 'System Admin':
        role = 'sysAdmin'; 
        break;
    }
    let pass = Math.random().toString(36).substring(7);

    let user = new User(
      role,
      this.addForm.value['email'],
      this.addForm.value['email'],
      pass,
      '',
      '',
      '',
      '',
    );

    this.userService.register(user).subscribe(
      (response: any) => {
        if (response.succeeded) {
          // this.initForm();
          // this.addForm.reset();
          this.addForm.patchValue({
            email: '',
          });
          this.addForm.markAsPristine();
          this.addForm.markAsUntouched();

          this._snackBar.open('Admin was created successfully. Pass: ' + pass, 'OK', {duration: 5000,});
          this.addForm.reset();
      } else {
        response.errors.forEach(element => {
          switch (element.code) {
            case 'DuplicateUserName':
              this._snackBar.open('Username is already taken', 'OK', {duration: 5000,});
              break;

            default:
              this._snackBar.open(element.description, 'OK', {duration: 5000,});
              break;
          }
        });
      }
      },
      error => {
        if (error.status == 400) {
          this._snackBar.open(error.error.message, 'OK', {duration: 5000,});
        }
        else
          console.log(error);
      });
  }

  private updateUser() {
    let updatedUser = new User('', '', '', '',
        this.registerForm.value['name'],
        this.registerForm.value['surname'],
        this.registerForm.value['city'],
        this.registerForm.value['phone']);
      this.userService.editUser(updatedUser).subscribe(
        (response: any) => {
          let tempUser: User = Object.assign(new User(this.role, '', '', '', '', '', '', ''), response);
          tempUser.tOFriendsA = this.loggedInUser.tOFriendsA;
          tempUser.tOFriendsB = this.loggedInUser.tOFriendsB;
          localStorage.setItem('user', JSON.stringify(tempUser));
          this.loggedInUser = tempUser;
          this.registerForm.controls.email.disable();
          this.registerForm.controls.password.disable();
          this.registerForm.controls.confirmPassword.disable();
          this.registerForm.controls.name.disable();
          this.registerForm.controls.surname.disable();
          this.registerForm.controls.city.disable();
          this.registerForm.controls.phone.disable();
          this.isEdit = false;
          this.isChangePassword = false;

          this.registerForm.patchValue({
            oldPassword: '',
            password: '',
            confirmPassword: ''
          });

          this.registerForm.markAsPristine();
          this._snackBar.open('Information updated successfully', 'OK', {duration: 5000,});
        },
        error => {
          console.log(error);
        }
      );
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    if (this.isEdit) {
      if (this.isChangePassword) {
        if (this.registerForm.value['oldPassword'] !== '' && this.registerForm.value['oldPassword'] !== null) { //Nesto je uneseno Old Password
          //Poziv bekendu za izmenu sifre
          this.userService.updatePassword(this.registerForm.value['oldPassword'], this.registerForm.value['password']).subscribe(
            (res: any) => {
              console.log(res);
              if (res.succeeded) {
                this.updateUser();
              } else {
                if (res.errors[0].code === 'PasswordMismatch') {
                  this._snackBar.open('Old password is incorect', 'OK', { duration: 5000, });
                } else if (res.errors[0].code === 'PasswordTooShort') {
                  this._snackBar.open('Password must be at least 4 characters long.', 'OK', { duration: 5000, });
                }
              }
            },
            error => {
              console.log(error);
            }
          );
        }
        else { //Nista nije uneseno u Old Password
          if (this.registerForm.value['password'] !== '') { //Nesto je uneseno u New Password
            this._snackBar.open('Old password is required', 'OK', { duration: 5000, });
            return;
          }
        } 
      } else {
        this.updateUser();
      }
    } else {
      let user = new User(
        'regular',
        this.registerForm.value['username'],
        this.registerForm.value['email'],
        this.registerForm.value['password'],
        this.registerForm.value['name'],
        this.registerForm.value['surname'],
        this.registerForm.value['city'],
        this.registerForm.value['phone'],
      );
  
      this.userService.register(user).subscribe(
        (response: any) => {
          if (response.succeeded) {
            this.registerForm.reset();
            this._snackBar.open('Please verify your e-mail address', 'OK', {duration: 5000,});
            this.router.navigate(['/main']);
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this._snackBar.open('Username is already taken', 'OK', {duration: 5000,});
                break;

              default:
                this._snackBar.open(element.description, 'OK', {duration: 5000,});
                break;
            }
          });
        }
        },
        error => {
          console.log(error);
        });
    }
  }

  onCancel() {
    this.registerForm.patchValue({
      email: this.loggedInUser.email,
      oldPassword: '',
      password: '',
      confirmPassword: '',
      name: this.loggedInUser.name,
      surname: this.loggedInUser.surname,
      city: this.loggedInUser.city,
      phone: this.loggedInUser.phoneNumber,
    });
    this.registerForm.controls.email.disable();
    this.registerForm.controls.oldPassword.disable();
    this.registerForm.controls.password.disable();
    this.registerForm.controls.confirmPassword.disable();
    this.registerForm.controls.name.disable();
    this.registerForm.controls.surname.disable();
    this.registerForm.controls.city.disable();
    this.registerForm.controls.phone.disable();
    this.isEdit = false;
    this.isChangePassword = false;
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
  }

  canExit(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.addForm == undefined) {
      if (this.registerForm.dirty){
        return confirm("All unsaved changes will be lost. Are you sure you want to leave this page?");
      }
      else{
        return true;
      }
    }

    if(this.addForm.dirty){
      return confirm("All unsaved changes will be lost. Are you sure you want to leave this page?");
    }
    else{
      return true;
    }
  }

}
