import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GerichtInfo, ProduktEigenschaft } from 'src/app/api.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { ApiService } from 'src/app/api.service';
import { catchError, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateNewGerichtDialogComponent } from '../create-new-gericht-dialog/create-new-gericht-dialog.component';
import { AddToShoppinglistComponent } from './add-to-shoppinglist/add-to-shoppinglist.component';
import { PageTitleService } from 'src/app/page-title.service';

/** 
 * component that displays information about a specific dish (Gericht) and allows the user to edit or delete it.
 * It also shows the ingredients (Produkte) of the dish and their respective quantities.
 */
@Component({
  selector: 'app-view-gericht',
  templateUrl: './view-gericht.component.html',
  styleUrls: ['./view-gericht.component.css']
})
export class ViewGerichtComponent implements OnInit {

  /** Boolean that determines whether the "Zutaten in die Einkaufsliste" button should be displayed or not. */
  hideAddToShoppinglistButton = false;

  /** Array of strings that specifies the column names for the ingredients table. */
  zutatenDisplayedColumns = ['produkt', 'Menge'];

  /** Object that contains information about a specific dish (GerichtInfo). */
  gericht: GerichtInfo = {
    geriId: -1,
    bezeichnung: '',
    zubereitungsdauer: '',
    rezept: '',
    schwierigkeitsgrad: -1,
    produkte: []
  };

  constructor(
    private dialog: MatDialog,
    //public dialogRef: MatDialogRef<ViewGerichtComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private pageTitleService: PageTitleService,
  ) {
  }

  /** Subscribes to the route parameter map and calls the loadGerichtInfo method with the id parameter from the route. */
  ngOnInit(): void {
    this.route.paramMap.subscribe( (params: any) => {
      const id = Number( params.get('id') );
      this.loadGerichtInfo( id );
    });
  }

  /** Returns an array of strings that represent the properties (Eigenschaften) of the products (Produkte) in the gericht attribute. */
  getGerichtEigenschaften( gericht: GerichtInfo ): string[] {
    if ( gericht.produkte == null ) { return []; }
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

  /** Opens a dialog box for editing the dishs information */
  public updateDish() {
    this.dialog.open(CreateNewGerichtDialogComponent, { data: { gerichtInfo: this.gericht } }).afterClosed().subscribe((result: GerichtInfo) => {
      if (result) {
        this.apiService.gerichtUpdate$( result )
        .subscribe(
          (  ) => this.loadGerichtInfo( this.gericht.geriId ),
          (error: HttpErrorResponse) => console.log(error)
        );
      } else {
        this.loadGerichtInfo( this.gericht.geriId );
      }
    });
  }

  /** Deletes the currently displayed dish */
  public deleteDish() {
    this.apiService.gerichtDelete$( this.gericht )
    .subscribe(
      (  ) => this.router.navigate(['/gerichte']),
      (error: HttpErrorResponse) => console.log(error)
    );
  }
  public addZutatenToEinkaufsliste() {
    this.dialog.open(AddToShoppinglistComponent, { data: { gericht: this.gericht } }).afterClosed().subscribe((result: boolean) => {
      if ( result != null && result === true ) {
        this.hideAddToShoppinglistButton = true;
      }
    });
  }

  public formatText( text: string ) {
    return text
    .replace(/\n/g,'<br>');
  }

  /** Load information about a dish by its ID from the server */
  private loadGerichtInfo( gerichtId: number ) {
    this.apiService.getGericht$( gerichtId )
    .subscribe(
      ( result: GerichtInfo ) => {
        this.gericht = result;
        this.pageTitleService.setTitle('Gericht ' + result.bezeichnung);
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }
}
