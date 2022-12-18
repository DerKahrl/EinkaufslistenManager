import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import { ProduktInfo, EinkaufsListeProdukte, EinkaufsListe } from 'src/app/api.interface';
import { ApiService } from 'src/app/api.service';
import { catchError, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateNewProductComponent } from 'src/app/gerichte/produkte-verwaltung/create-new-product/create-new-product.component';

/** Component that displays a dialog to add or edit a product in an EinkaufsListe. */
@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {

  /** Boolean value that determines whether the component is in edit mode or add mode */
  isInEditingMode = false;

  /** Form control for the product's name */
  myControl = new FormControl<string | ProduktInfo>('');
  filteredOptions: Observable<ProduktInfo[]> = new Observable<ProduktInfo[]>();

  /** Array of all available products */
  public alleProdukte: ProduktInfo[] = [];

  /** EinkaufsListeProdukte object that represents the product to add or edit */
  public data: EinkaufsListeProdukte = {
    ekliProdId: -1,
    menge: '',
    einheit: '',
    produkt: {} as ProduktInfo
  }

  /** Required form control for the product's unit of measurement */
  fcEinheit = new FormControl(this.data.einheit, [Validators.required]);
  /** Required form control for the product's quantity */
  fcMenge = new FormControl(this.data.menge, [Validators.required]);


  options = this.formBuilder.group({
    Menge: this.fcMenge,
    Einheit: this.fcEinheit,
    myControl: this.myControl
  });

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    private apiService: ApiService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: {einkaufsliste: EinkaufsListe; data?: EinkaufsListeProdukte},
  ) {
    if (this.dialogData.data) {
      // Es soll ein Eintrag bearbeitet werden:
      this.data = this.dialogData.data;
      this.isInEditingMode = true;
    }
    this.updateProducts();
  }

  /** Initializes the component and sets up the product's name form control with filtering and autocompletion */
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      tap( (value: string | ProduktInfo | null): void => {
        if ( value ) {

          if ( typeof value !== 'string' ) {
            this.data.produkt = value;
            this.data.einheit = value.commoneinheit;
            //this.data.Bez = undefined;
            this.checkIfProductAlreadyInShoppingList();
          } else {

            const prod = this.alleProdukte.find( (v) => v.bezeichnung.toLocaleLowerCase() === value.toLocaleLowerCase().trim() );
            if (prod) {
              this.data.produkt = prod;
              this.data.einheit = prod.commoneinheit;
              //this.data.Bez = undefined;
              this.checkIfProductAlreadyInShoppingList();
            } else {
              //this.data.Bez = value;
              this.data.produkt = {
                prodId: -99,
                bezeichnung: value.trim(),
                istZutat: true,
                eigenschaften: [],
                commoneinheit: '',
              };
            }

          }
        }
      } ),
      startWith(''),
      map( (value: any) => {
        const name = typeof value === 'string' ? value : value?.bezeichnung;
        return name ? this._filter(name as string) : this.alleProdukte.slice();
      }),
    );

    if (this.isInEditingMode) {
      this.myControl.setValue(this.data.produkt);
      this.myControl.disable();
    }
  }

  /** Opens a dialog to create a new product and adds it to the list of options */
  public newProduct() {
    const template: ProduktInfo = {
      prodId: -1,
      istZutat: true,
      bezeichnung: this.data.produkt.bezeichnung,
      eigenschaften: [],
      commoneinheit: this.data.einheit,
    };
    this.dialog.open(CreateNewProductComponent,{data: template}).afterClosed().subscribe((result: ProduktInfo) => {
      if ( result ) {
        this.apiService.productCreate$(result)
        .subscribe(
          ( ) => this.updateProducts(),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
  }

  public displayFn(user: ProduktInfo): string {
    return user && user.bezeichnung ? user.bezeichnung : '';
  }

  /** Checks if the product is already in the EinkaufsListe and if so it then edits that entry */
  private checkIfProductAlreadyInShoppingList() {
    const entry = this.dialogData.einkaufsliste.inhalt.find( (value) => value.produkt.prodId === this.data.produkt.prodId );
    if (entry == null) {
      if ( this.data.ekliProdId !== -1 ) {
        this.data.ekliProdId = -1; // Id auf -1 zurücksetzten
        this.data.menge = '';
        this.data.einheit = this.data.produkt.commoneinheit;
      }
    } else {
      this.data = Object.assign({},entry);
    }
  }

  private _filter(name: string): ProduktInfo[] {
    const filterValue = name.toLowerCase();

    return this.alleProdukte.filter(option => option.bezeichnung.toLowerCase().includes(filterValue));
  }

  private updateProducts() {
    this.apiService.getAllProducts$( )
    .subscribe(
      ( result: ProduktInfo[] ) => {
        this.alleProdukte = result;
        if (!this.isInEditingMode) {
          this.myControl.setValue(null);
        }
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }
}
