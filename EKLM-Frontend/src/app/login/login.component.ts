import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ServerErrorDTO } from '../api.interface';

//Credits to https://dzone.com/articles/create-a-beautiful-login-form-with-angular-material

/** Form for logging in to the application */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup;
  public loggingIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.authService.checkAuthentication();
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  /** Submits the form if it is valid, and starts the login process. */
  public onSubmit() {
    if (this.form.valid === false) return;

    const usernameControl = this.form.get('username');
    const passwordControl = this.form.get('password');
    if (usernameControl === null || passwordControl === null) return;

    this.loggingIn = true;

    //setTimeout( ()=>{this.loggingIn=false;},2000 );

    this.authService.login(
      usernameControl.value,
      passwordControl.value,
      {
        onError: ( r ) => { this.loggingIn = false; this.displayError(r); },
        onResult: () => {
          this.loggingIn = false;
          this.router.navigate(['/einkaufsliste']);
        }
      }
    );

  }
  /** Displays an error message using the MatSnackBar */
  public displayError(err: ServerErrorDTO) {
    let message = err.message;
    const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';

    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition,
      verticalPosition,
    });
  }
}
