import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GerichtInfo, EinkaufsListe, ProduktInfo, EinkaufsListeProdukte } from 'src/app/api.interface';
import { ApiService } from 'src/app/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith, take, catchError, tap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';

/** Component that allows the user to add ingredients for a meal to a shopping list. */
@Component({
  selector: 'app-add-to-shoppinglist',
  templateUrl: './add-to-shoppinglist.component.html',
  styleUrls: ['./add-to-shoppinglist.component.css']
})
export class AddToShoppinglistComponent implements OnInit, OnDestroy {

  /** Object that is used to determine if the screen width is less than or equal to 900 pixels. */
  public mobileQuery_900px: MediaQueryList;

  /** Boolean that indicates whether all of the ingredients for the meal were placed into the selected shopping list. */
  public ingridientsAreInShoppinglist = false;

  /** Array of product IDs that are already present in the selected shopping list. */
  public problematicIngridients: number[] = [];

  /** Object that is used to bind the dropdown menu for selecting the shopping list to the component's template. */
  public myControl = new FormControl<string | EinkaufsListe>('');
  public filteredOptions: Observable<EinkaufsListe[]> = new Observable<EinkaufsListe[]>();


  /** Array of strings that specifies the column names for the table of ingredients. */
  public zutatenDisplayedColumns = ['produkt', 'Menge', 'warning'];

  /** Array of EinkaufsListeProdukte objects that stores the ingredients for the meal. */
  public produkte: EinkaufsListeProdukte[] = [];

  /** Object of the currently selected shopping list. */
  public einkaufsliste: EinkaufsListe | null = null;

  /** Array of all available shopping lists. */
  public einkaufslisten: EinkaufsListe[] = [];

  /** Function that is called when the screen width changes. It triggers a change detection update for the component. */
  private _mobileQueryListener: () => void;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: { gericht?: GerichtInfo },
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef, 
    private media: MediaMatcher,
  ) {
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery_900px = this.media.matchMedia('(max-width: 900px)');
    this.mobileQuery_900px.addListener(this._mobileQueryListener);

    if (this.dialogData && this.dialogData.gericht) {
      //this.gericht = this.dialogData.gericht;
      this.produkte = Object.assign( [], this.dialogData.gericht.produkte );
    }
    this.updateShoppingLists();
  }

  /** Lifecycle hook is used to remove the _mobileQueryListener function as a media query listener when the component is destroyed. */
  ngOnDestroy(): void {
    this.mobileQuery_900px.removeListener(this._mobileQueryListener);
  }

  /**Lifecycle hook sets up the filteredOptions observable to filter the options for the dropdown menu based on the user's input. */
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      tap((value: string | EinkaufsListe | null): void => {
        if (value) {
          if ( typeof value === 'string' ) {

            const ekl = this.einkaufslisten.find( e => e.bezeichnung.toLocaleLowerCase().localeCompare( value.toLocaleLowerCase() ) === 0 );
            if (ekl != null) {
              this.einkaufsliste = ekl;
            } else {
              this.einkaufsliste = null;
            }
          } else {
            this.einkaufsliste = value;
          }
        } else {
          this.einkaufsliste = null;
        }
        this.updateProblematicIngridients();
      }),
      startWith(''),
      map( (value:any) => {
        const name = typeof value === 'string' ? value : value?.bezeichnung;
        return name ? this._filter(name as string) : this.einkaufslisten.slice();
      }),
    );
  }

  public displayFn(user: EinkaufsListe): string {
    return user && user.bezeichnung ? user.bezeichnung : '';
  }

  /** Fetches a list of all available shopping lists from the API and updates the einkaufslisten array. */
  public updateShoppingLists(): void {
    this.apiService.getCurrentUserShoppinglists$()
    .subscribe(
      ( result: EinkaufsListe[] ) => {
        this.einkaufslisten = result;
          if ( this.einkaufsliste != null ) {
            const EKLI_ID = this.einkaufsliste.id;
            const neueListe = result.find( value => value.id === EKLI_ID );
            if ( neueListe ) {
              this.einkaufsliste.inhalt = neueListe.inhalt;
            }
          }
        this.myControl.updateValueAndValidity();
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  /** Determines which ingredients already present in the selected shopping list */
  public updateProblematicIngridients(): void {
    if ( this.einkaufsliste == null ) { return; }
    this.problematicIngridients = this.einkaufsliste.inhalt
    .filter( value => this.produkte.find( ingridient => ingridient.produkt.prodId === value.produkt.prodId ) != null )
    .reduce<number[]>(
      ( accumulator, currentValue ) =>
        accumulator.concat( currentValue.produkt.prodId ),
      []
    );
  }

  /** Places all ingredients into the slected shopping list */
  public placeIngridientToShoppingList(): void {
    if ( !this.einkaufsliste ) { return; }

    this.myControl.disable();
    this.ingridientsAreInShoppinglist = true;
    const EKL_ID = this.einkaufsliste.id;

    const requests: Observable<void>[] = [];
    this.produkte.forEach(
      p => {
        if ( !this.isIngridientProblematic(p) ) {
          requests.push(
            this.addIngirientToShoppinglist( EKL_ID, p )
          );
          this.produkte = this.produkte.filter( prod => prod !== p )
        }
      }
    );

    // Warten bis alle fertig sind und dann erst die Listen updaten:
    forkJoin(requests).subscribe(
      (  ) => {
        this.updateShoppingLists();
      }
    );

  }

  private _filter(name: string): EinkaufsListe[] {
    const filterValue = name.toLowerCase();

    return this.einkaufslisten.filter(option => option.bezeichnung.toLowerCase().includes(filterValue));
  }

  /** Check if this ingredient is problematic */
  private isIngridientProblematic( entry: EinkaufsListeProdukte ): boolean {
    return this.einkaufsliste != null &&
      this.einkaufsliste.inhalt.find(
        value => value.produkt.prodId === entry.produkt.prodId
      ) != null;
  }

  private addIngirientToShoppinglist(EKL_ID: number, produkt: EinkaufsListeProdukte ): Observable<void> {
    return this.apiService.einkaufslisteAddProdukt$( EKL_ID, produkt );
  }
}
