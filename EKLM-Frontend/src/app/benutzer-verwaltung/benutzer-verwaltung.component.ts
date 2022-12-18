import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { UserInfo, LoginDTO } from '../api.interface';
import { ApiService } from '../api.service';
import { catchError, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { PageTitleService } from '../page-title.service';

/** Component that displays a list of users and allows the user to create, edit, and delete them. */
@Component({
  selector: 'app-benutzer-verwaltung',
  templateUrl: './benutzer-verwaltung.component.html',
  styleUrls: ['./benutzer-verwaltung.component.css']
})
export class BenutzerVerwaltungComponent implements OnInit {

  /** Array of UserInfo objects that represents the list of users */
  public userdata: UserInfo[] = [];

  /** Array of strings that defines the columns to display in the user list */
  public userdataColumns = ['username', 'owner', 'access', 'buttons'];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private authService: AuthService,
    private pageTitleService: PageTitleService,
  ) {
    this.updateUserList();
    this.pageTitleService.setTitle('Benutzer');
  }

  ngOnInit(): void {
  }

  /** Retrieves the list of users from the API and updates the userdata property */
  public updateUserList(): void {
    this.apiService.getUsersAll$()
      .subscribe(
        (result: UserInfo[]) => this.userdata = result.map( 
          v => {
            v.accessibleEinkaufslisten = v.accessibleEinkaufslisten.filter( 
              a => v.einkaufslisten.find( x => x.id === a.id ) == null
            );
            return v;
          }
        ),
        (error: HttpErrorResponse) => console.log(error)
      );
  }

  /** Opens a dialog to create a new user and adds it to the list */
  public newUser(): void {
    this.dialog.open(CreateUserDialogComponent).afterClosed().subscribe(
      (result: LoginDTO) => {
        if (result) {
          this.authService.hashPassword(result.username,result.password).then(
            (passwordHashed) => {
              result.password = passwordHashed;
              this.apiService.createUser$(result)
                .subscribe(
                  () => this.updateUserList(),
                  (error: HttpErrorResponse) => console.log(error)
                );
            });
        }
      }
    );
  }

  /** Opens a dialog to edit an existing user and updates the data */
  public editUser(user: UserInfo) {
    this.dialog.open(CreateUserDialogComponent, { data: user }).afterClosed().subscribe((result: LoginDTO) => {
      if (result) {
        user.username = result.username;
        this.authService.hashPassword(user.username,result.password).then(
          (passwordHashed) => {
            this.apiService.updateUser$(user, result.password === '' ? '' : passwordHashed)
              .subscribe(
                () => this.updateUserList(),
                (error: HttpErrorResponse) => console.log(error)
              );
          });
      }
    });
  }

  /** Deletes a user from the list */
  public deleteUser(user: UserInfo) {
    this.apiService.deleteUser$(user)
      .subscribe(
        () => this.updateUserList(),
        (error: HttpErrorResponse) => console.log(error)
      );
  }

}
