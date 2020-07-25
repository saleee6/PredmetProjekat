import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  password: string = '';
  confirmPassword: string = '';
  hide1 = true;
  hide2 = true;

  confirmPasswordFormControl = new FormControl(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {password: string, confirmPassword: string},
    private dialogRef:MatDialogRef<ChangePasswordComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = new FormGroup({
      'password': new FormControl(null, Validators.required),
      'confirmPassword': this.confirmPasswordFormControl,
    },
    {validators: ConfirmPasswordValidator.MatchPassword});
  }

  onChange() {
    this.userService.updatePassword(localStorage.getItem('tempPassword'), this.changePasswordForm.value['password']).subscribe(
      (res: any) => {
        console.log(res);
        if (res.succeeded) {
          localStorage.removeItem('tempPassword');
          localStorage.removeItem('is-first-log-in');
          this.dialogRef.close('success');
        } else {
          if (res.errors[0].code === 'PasswordTooShort') {
            this._snackBar.open('Password must be at least 4 characters long.', 'OK', { duration: 5000, });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
