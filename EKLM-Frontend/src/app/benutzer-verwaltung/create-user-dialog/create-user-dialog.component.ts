import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginDTO, UserInfo } from 'src/app/api.interface';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

/** A component that displays a dialog to create or edit a user. */
@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent {

  data: LoginDTO = {
    username: '',
    password: '',
  };

  /** Required text field for the user's username */
  fcUsername = new FormControl(this.data.username, [Validators.required]);

  /** Required text field for the user's password */
  fcPassword = new FormControl(this.data.password, [Validators.required]);

  form = this.formBuilder.group({
    password: this.fcPassword,
    username: this.fcUsername,
  });

  /** Boolean value that determines whether the component is in edit mode or create mode */
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: UserInfo,
  ) {
    if ( this.dialogData ) {
      this.data.username = this.dialogData.username;
      this.isEditing = true;
    }
  }
}
