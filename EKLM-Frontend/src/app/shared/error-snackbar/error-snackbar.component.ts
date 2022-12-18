import { Component, OnInit, inject, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.css']
})
export class ErrorSnackbarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<ErrorSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: {message: string; httpError: HttpErrorResponse}
  ) {}

  /** Extract the API path from the full URL */
  public getPath( fullURL: string | null ) {
    if ( !fullURL ) {return '';}
    const URLwithoutProtocol = fullURL.slice(8);
    const Hostname = URLwithoutProtocol.split('/',1)[0];
    return URLwithoutProtocol.replace(Hostname,'');
  }

}
