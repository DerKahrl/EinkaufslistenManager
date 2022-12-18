import { Component, OnInit, Inject } from '@angular/core';
import { GerichtInfo, ProduktInfo, EinkaufsListeProdukte, EinkaufsListe } from 'src/app/api.interface';
import { FormControl, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, take, catchError} from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Dialog component for creating and editing a Gericht */
@Component({
  selector: 'app-create-new-gericht-dialog',
  templateUrl: './create-new-gericht-dialog.component.html',
  styleUrls: ['./create-new-gericht-dialog.component.css']
})
export class CreateNewGerichtDialogComponent implements OnInit {
  
  /** Array of strings that specifies the column names for the table of ingredients. */
  public zutatenDisplayedColumns = ['produkt', 'Menge', 'buttons'];

  /** Object that stores the information for the meal being created or edited. */
  public gericht: GerichtInfo = {
    geriId: -1,
    bezeichnung: '',
    zubereitungsdauer: '',
    rezept: '',
    schwierigkeitsgrad: 1,
    produkte: []
  };

  /** Object that stores temporary information for a new ingredient being added to the Gericht. */
  public newProductInfo = {} as EinkaufsListeProdukte;

  /** Array of all available products that can be used as ingredients */
  public alleProdukte: ProduktInfo[] = [];

  /** Object that is used to bind the dropdown menu for selecting ingredients to the component's template. */
  public myControl = new FormControl<string | ProduktInfo>('');

  /** Stores the filtered list of options for the dropdown menu based on the user's input. */
  public filteredOptions: Observable<ProduktInfo[]> = new Observable<ProduktInfo[]>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: {gerichtInfo?: GerichtInfo},
    private apiService: ApiService,
  ) {
    this.updateProducts();
    if ( dialogData && dialogData.gerichtInfo ) {
      this.gericht = dialogData.gerichtInfo;
    }
  }

  /** Removes an ingredient from the list of ingredients for the meal. */
  deleteProdukt( entry: EinkaufsListeProdukte ) {
    this.gericht.produkte = this.gericht.produkte.filter( value => value !== entry )
  }

  /** Lifecycle hook that is called when the component is initialized. It sets up the filteredOptions */
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map( (value: any) => {
        const name = typeof value === 'string' ? value : value?.bezeichnung;
        return name ? this._filter(name as string) : this.alleProdukte.slice();
      }),
    );
  }

  displayFn(user: ProduktInfo): string {
    return user && user.bezeichnung ? user.bezeichnung : '';
  }

  /** Adds an ingredient to the list of ingredients for the meal. */
  addZutat() {
    if ( this.myControl.value == null ) { return; };

    if( typeof this.myControl.value === 'string' ) {
      const pr = this.alleProdukte.find( value => value.bezeichnung === this.myControl.value );
      if (pr) {
        this.newProductInfo.produkt = pr;
      } else {
        return;
      }
    } else {
      this.newProductInfo.produkt = this.myControl.value;
    }
    this.newProductInfo.ekliProdId = -1;
    if (  this.gericht.produkte != null ) {
      this.gericht.produkte = this.gericht.produkte.concat(this.newProductInfo);
    }
    this.newProductInfo = {} as EinkaufsListeProdukte;
    this.myControl.setValue(null);
  }

  private _filter(name: string): ProduktInfo[] {
    const filterValue = name.toLowerCase();

    return this.alleProdukte.filter(option => option.bezeichnung.toLowerCase().includes(filterValue));
  }

  /** Fetches a list of all available products from the API and updates the alleProdukte array. */
  updateProducts() {
    this.apiService.getAllProducts$( )
    .subscribe(
      ( result: ProduktInfo[] ) => {
        this.alleProdukte = result.filter( produkt => produkt.istZutat === true );
        this.myControl.updateValueAndValidity();
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }
}
