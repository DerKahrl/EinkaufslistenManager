import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProduktEigenschaft } from 'src/app/api.interface';
import { ApiService } from 'src/app/api.service';
import { take, catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateEigenschaftDialogComponent } from './create-eigenschaft-dialog/create-eigenschaft-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PageTitleService } from 'src/app/page-title.service';

@Component({
  selector: 'app-eigenschaften-verwaltung',
  templateUrl: './eigenschaften-verwaltung.component.html',
  styleUrls: ['./eigenschaften-verwaltung.component.scss']
})
export class EigenschaftenVerwaltungComponent implements AfterViewInit {

  /** Array of strings that defines the table columns and their corresponding values in the data source. */
  displayedColumns = ['id','bezeichnung','Anzeigen','buttons'];

  /** Instance of MatTableDataSource that stores the data to be displayed in the table. */
  dataSource = new MatTableDataSource<ProduktEigenschaft>();

  /** View child of type MatPaginator that is used to paginate the data in the table. */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private apiService: ApiService,
    private pageTitleService: PageTitleService,
  ) {
    this.loadPropertiesFromServer();
    this.pageTitleService.setTitle('Eigenschaften');
  }

  /** Removes a property from the data source and from the server. */
  deleteEntry( row: ProduktEigenschaft ) {
    this.dataSource.data = this.dataSource.data.filter( e => e !== row );
    this.apiService.deleteProperty$(row)
    .subscribe(
      ( ) => this.loadPropertiesFromServer(),
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  /** Opens a dialog to update an existing product property */
  updateEntry(row: ProduktEigenschaft) {
    this.dialog.open(CreateEigenschaftDialogComponent, {data: row}).afterClosed().subscribe((result: ProduktEigenschaft) => {
      if ( result ) {
        
        row.bezeichnung = result.bezeichnung;
        row.anzeigen = result.anzeigen;

        this.apiService.updateProperty$(result)
        .subscribe(
          ( ) => this.loadPropertiesFromServer(),
          (error: HttpErrorResponse) => this.loadPropertiesFromServer()
        );
      }
    });
  }

  /** Opens a dialog to create a new product property */
  newProperty() {
    this.dialog.open(CreateEigenschaftDialogComponent).afterClosed().subscribe((result: ProduktEigenschaft) => {
      if ( result ) {
        this.apiService.createProperty$(result)
        .subscribe(
          ( ) => this.loadPropertiesFromServer(),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
  }

  /** Load all existing product property from the server */
  loadPropertiesFromServer() {
    this.apiService.getAllProperties$()
    .subscribe(
      ( result: ProduktEigenschaft[] ) => this.dataSource.data = result,
      (error: HttpErrorResponse) => console.log(error)
    );    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
