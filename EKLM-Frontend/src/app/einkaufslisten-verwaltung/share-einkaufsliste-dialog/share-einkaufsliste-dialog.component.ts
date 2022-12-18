import { Component, OnInit, Inject } from '@angular/core';
import { UserInfo, EinkaufsListenInfo } from 'src/app/api.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { catchError, take, startWith, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

/**
 * Dialog component for sharing a shopping list with other users.
 *
 * Allows the user to view a list of users with access to the shopping list and add or remove users from the list.
 */
@Component({
  selector: 'app-share-einkaufsliste-dialog',
  templateUrl: './share-einkaufsliste-dialog.component.html',
  styleUrls: ['./share-einkaufsliste-dialog.component.css']
})
export class ShareEinkaufslisteDialogComponent implements OnInit {

  /** A list of all users in the system. */
  allUsers: UserInfo[] = [];

  /** A list of users that currently have access to the Einkaufsliste. */
  usersWithAccess: UserInfo[] = [];

  /** The Einkaufsliste being shared. */  
  einkaufsliste: EinkaufsListenInfo;

  /** Columns to be displayed in the table of users with access. */
  displayedColumns = ['id', 'username', 'buttons'];

  /** Form control for the user autocomplete. */
  myControl = new FormControl<string | UserInfo>('');
  
  /** Options for the user autocomplete. */
  options: UserInfo[] = [];

  /** Filtered options for the user autocomplete. */
  filteredOptions!: Observable<UserInfo[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: EinkaufsListenInfo,
    private apiService: ApiService,
  ) {
    this.einkaufsliste = this.dialogData;
    this.updateSharedWithUsers();
    this.updateAllUsers();
  }

  /** Initializes the component by setting up the user autocomplete */
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.addUser( value );
        const name = typeof value === 'string' ? value : value?.username;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  /** Removes a user's access to the Einkaufsliste */
  removeUser(user: UserInfo) {
    this.apiService.einkaufslisteUnshareWith$(this.einkaufsliste.id,user)
    .subscribe(
      () => this.updateSharedWithUsers(),
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  /**
   * Fetches the list of users who have access to the current shopping list.
   */
  updateSharedWithUsers() {
    this.updateAllUsers();
    this.apiService.einkaufslisteSharedWith$(this.einkaufsliste.id)
      .subscribe(
        (result: UserInfo[]) => {
          this.usersWithAccess = result;
          this.updateAutocomplete();
        },
        (error: HttpErrorResponse) => console.log(error)
      );
  }

   /**
   * Fetches the list of all users.
   */
  updateAllUsers() {
    this.apiService.getUsersAll$()
      .subscribe(
        (result: UserInfo[]) => {
          this.allUsers = result;
          this.updateAutocomplete();
        },
        (error: HttpErrorResponse) => console.log(error)
      );
  }

   /**
   * Update the autocomplete suggestions with users who don't have access to the Einkaufsliste yet
   */
  updateAutocomplete() {
    if ( this.allUsers == null || this.allUsers.length === 0 ) { return; }
    this.options = this.allUsers
                    .filter( value => !value.accessibleEinkaufslisten.find( l => l.id === this.einkaufsliste.id ) )
                    .filter( value => !value.einkaufslisten.find( l => l.id === this.einkaufsliste.id ) );
    this.myControl.updateValueAndValidity();
  }

  displayFn(user: UserInfo): string {
    return user && user.username ? user.username : '';
  }

  /** Gives a User access to the Einkaufsliste */
  addUser( userToAdd: string | UserInfo | null ) {
    //let userToAdd = this.myControl.value;
    if (userToAdd == null) {
      return;
    }
    if ( typeof userToAdd === 'string' ) {
      const usernmae = userToAdd.toString().toLocaleLowerCase();
      const user = this.allUsers.find( u => u.username.toLocaleLowerCase().localeCompare( usernmae ) === 0 );
      if ( user == null ) {
        return;
      }
      userToAdd = user;
    }
    this.apiService.einkaufslisteShareWith$(this.einkaufsliste.id,userToAdd)
    .subscribe(
      () => {
        this.myControl.reset();
        this.updateSharedWithUsers();
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  private _filter(name: string): UserInfo[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.username.toLowerCase().includes(filterValue));
  }
}
