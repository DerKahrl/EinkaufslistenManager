import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProduktInfo, ProduktEigenschaft } from 'src/app/api.interface';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { HttpErrorResponse } from '@angular/common/http';

/** Component for creating new products (Produkte) */
@Component({
  selector: 'app-create-new-product',
  templateUrl: './create-new-product.component.html',
  styleUrls: ['./create-new-product.component.css']
})
export class CreateNewProductComponent {

  /** References the propertyInput element in the template. It is used to clear the chip input value. */
  @ViewChild('propertyInput') propertyInput!: ElementRef<HTMLInputElement>;

  /** Object that holds information about the product being created. */
  produkt: ProduktInfo = {
    prodId: -1,
    istZutat: true,
    bezeichnung: '',
    eigenschaften: [],
    commoneinheit: '',
  };

  /** Array of numbers that specifies the keys that can be used to separate chip input values. */
  separatorKeysCodes: number[] = [ENTER, COMMA,SEMICOLON];

  /** Instance of the FormControl class that is used to control the chip input value. */
  propertyCtrl = new FormControl('');

  /** Observable of strings that holds the filtered list of product properties. */
  filteredproperties: Observable<string[]>;

  /** Array of strings that holds the current list of product properties. */
  properties: string[] = [];

  /** Array of strings that holds all product properties retrieved from the server. */

  allproperties: string[] = [];
  /** Array of ProduktEigenschaft objects that holds all product properties retrieved from the server. */
  alleEigenschaften: ProduktEigenschaft[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ProduktInfo,
    private apiService: ApiService
  ) {
    if ( this.dialogData && this.dialogData.prodId != null ) {
      this.produkt = Object.assign( {}, this.dialogData );
      this.properties = this.produkt.eigenschaften.reduce<string[]>(
        (a,c) => a.concat(c.bezeichnung),
        []
      );
    }
    this.filteredproperties = this.propertyCtrl.valueChanges.pipe(
      startWith(null),
      map((property: string | null) => (property ? this._filter(property) : this.allproperties.slice())),
    );
    this.loadPropertiesFromServer();
  }

  /**
   * add is a method that is called when a new chip input value is added.
   * It adds the value to the properties array and updates the produkt's eigenschaften.
   * It also clears the chip input value.
   * @param event a MatChipInputEvent object that holds information about the chip input event
   */
  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our property
    if (value) {
      if ( this.alleEigenschaften.find( (prop) => prop.bezeichnung.toLocaleLowerCase() === value.toLocaleLowerCase() ) != null ) {
        
        // But only if it exists:
        this.properties.push(value); 
        this.updateProduktEigenschaften();

        // Clear the input value
        event.chipInput!.clear();

        this.propertyCtrl.setValue(null);
      }
    }
  }

  /** Removes a property from the properties array and updates the produkt's eigenschaften. */
  public remove(property: string): void {
    const index = this.properties.indexOf(property);

    if (index >= 0) {
      this.properties.splice(index, 1);
    }
    this.updateProduktEigenschaften();
  }

  /** 
   * selected is a method that is called when a chip input value is selected from the autocomplete list.
   * It adds the value to the properties array and updates the produkt's eigenschaften.
   * It also clears the chip input value.
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    this.properties.push(event.option.viewValue);
    this.updateProduktEigenschaften();
    this.propertyInput.nativeElement.value = '';
    this.propertyCtrl.setValue(null);
  }

  /**
   * updates the produkt's eigenschaften based on the current values in the properties array.
   * It maps each property string in the properties array to a ProduktEigenschaft object in the alleEigenschaften array.
   */
  public updateProduktEigenschaften() {
    this.produkt.eigenschaften = this.properties.map<ProduktEigenschaft>(
      (str) => this.alleEigenschaften.find( 
        (prop) => prop.bezeichnung.toLocaleLowerCase() === str.toLocaleLowerCase()
        )
        || {eigsId: -1, bezeichnung: str, vergleichsGruppe: -1, prio: -1, anzeigen: true }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allproperties.filter(property => property.toLowerCase().includes(filterValue));
  }

  /** Retvies all product properties from the server */
  private loadPropertiesFromServer() {

    this.apiService.getAllProperties$()
    .subscribe(
      ( result: ProduktEigenschaft[] ) => {
        this.alleEigenschaften = result;
        this.allproperties = this.alleEigenschaften.reduce<string[]>(
          (accumulator, currentValue) => accumulator.concat( currentValue.bezeichnung ), []
        );
        this.propertyCtrl.setValue(null);
      },
      (error: HttpErrorResponse) => console.log(error)
    );    
  }
}
