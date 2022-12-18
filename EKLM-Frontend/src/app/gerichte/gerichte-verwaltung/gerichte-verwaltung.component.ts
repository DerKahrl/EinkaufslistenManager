import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GerichtInfo, ProduktEigenschaft } from 'src/app/api.interface';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateNewGerichtDialogComponent } from './create-new-gericht-dialog/create-new-gericht-dialog.component';
import { ApiService } from 'src/app/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageTitleService } from 'src/app/page-title.service';

/** Component for managing (verwaltung) dishes (Gerichte). */
@Component({
  selector: 'app-gerichte-verwaltung',
  templateUrl: './gerichte-verwaltung.component.html',
  styleUrls: ['./gerichte-verwaltung.component.scss']
})
export class GerichteVerwaltungComponent implements AfterViewInit {

  /** Instance of the MatTableDataSource that is used to display the GerichtInfo objects in a table. */
  dataSource = new MatTableDataSource<GerichtInfo>();

  /** References the paginator element in the template. It is used to paginate the table of GerichtInfo objects. */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Array of strings that specifies the columns that should be displayed in the table of GerichtInfo objects. */
  displayedColumns = [
    'Bezeichnung',
    'Zubereitungsdauer',
    'Schwirigkeitsgrad',
    'Eigenschaften',
    'buttons'
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private pageTitleService: PageTitleService,
    ) {
      this.updateGerichte();
      this.pageTitleService.setTitle('Gerichte');
    }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Returns an array of strings that represent the properties (Eigenschaften) of the products (Produkte) in the gericht attribute. */
  getGerichtEigenschaften( gericht: GerichtInfo ): string[] {
    if ( !gericht.produkte ) { return []; }

    const alleEigenschaften = gericht.produkte.reduce<ProduktEigenschaft[]>(
        ( accumulator, currentValue ) => accumulator.concat(currentValue.produkt.eigenschaften),
        []
      ).filter( (elem, index, self) => self.find( v => elem.eigsId === v.eigsId ) != null );

    const alleGruppen = alleEigenschaften
    .filter(v => v.vergleichsGruppe >= 0 && v.prio >= 0)
    .reduce<ProduktEigenschaft[][]>(
      (rv, x) => {
        (rv[x.vergleichsGruppe+1] = rv[x.vergleichsGruppe+1] || []).push(x);
        return rv;
      },
      []
    )
    .map(v => v.sort((a, b) => a.prio - b.prio));

    const ohneGruppe = alleEigenschaften.filter(v => v.vergleichsGruppe === -1 || v.prio === -1);
    
    const alleAnzeigen = alleGruppen.reduce( (p, c) => p.concat(c[0]), [] ).concat(ohneGruppe).filter( v => v.anzeigen === true );
    return  alleAnzeigen.reduce<string[]>(
          (a, c) => a.concat( c.bezeichnung ), []
        )
        .filter( (elem, index, self) => index === self.indexOf(elem) )
        .sort();
  }

  /** Deletes a dish */
  deleteEntry( gericht: GerichtInfo ) {
    this.dataSource.data = this.dataSource.data.filter( e => e !== gericht );
    this.apiService.gerichtDelete$( gericht )
    .subscribe(
      () => this.updateGerichte(),
      (error: HttpErrorResponse) => this.updateGerichte()
    );
  }

  /** Opens a dialog to edit the information for the dish */
  updateEntry( entry: GerichtInfo ) {
    this.dialog.open(CreateNewGerichtDialogComponent, { data: { gerichtInfo: entry } }).afterClosed().subscribe((result: GerichtInfo) => {
      if (result) {
        this.apiService.gerichtUpdate$( result )
        .subscribe(
          (  ) => this.updateGerichte(),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
    //Gleichzeitug den Rezept-Text noch laden:
    this.apiService.getGericht$( entry.geriId )
    .subscribe(
      ( result: GerichtInfo ) => entry.rezept = result.rezept,
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  /** Opens a dialog for creating a new dish */
  newRecipe() {
    this.dialog.open(CreateNewGerichtDialogComponent).afterClosed().subscribe((result: GerichtInfo) => {
      if (result) {
        this.apiService.gerichtCreate$( result )
        .subscribe(
          (  ) => this.updateGerichte(),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
  }

  /** Navigate to a page with more information about the dish */
  clickedGericht( gericht: GerichtInfo  ) {
    this.router.navigate(['/gerichte', gericht.geriId]);
  }

  /** Load all dishes from server */
  updateGerichte() {
    this.apiService.getAllGerichte$( )
    .subscribe(
      ( result: GerichtInfo[] ) => this.dataSource.data = result,
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
