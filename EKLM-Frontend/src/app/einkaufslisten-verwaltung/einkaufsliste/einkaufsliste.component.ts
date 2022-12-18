import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { EinkaufsListe, EinkaufsListeProdukte } from 'src/app/api.interface';
import { ApiService } from 'src/app/api.service';
import { catchError, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareEinkaufslisteDialogComponent } from '../share-einkaufsliste-dialog/share-einkaufsliste-dialog.component';
import { Sort } from '@angular/material/sort';

/** A component that displays and allows the user to interact with an EinkaufsListe object. */
@Component({
  selector: 'app-einkaufsliste',
  templateUrl: './einkaufsliste.component.html',
  styleUrls: ['./einkaufsliste.component.css']
})
export class EinkaufslisteComponent implements OnInit {

  /**
   * EinkaufsListe object to display
   */
  @Input()
  einkaufsliste!: EinkaufsListe;

  /**
   *  array of product ids in the EinkaufsListe to highlight
   */
  @Input()
  productsToHighlight: number[] = [];

  /**
   *  boolean value that determines whether to display the "eigenschaften" column in the list of products
   */
  @Input()
  set hideProperties( v: boolean) {
    if ( v ) {
      this.displayedColumns = [ 'bezeichnung', 'Menge', 'Einheit', 'buttons' ];
    } else {
      this.displayedColumns = [ 'bezeichnung', 'Menge', 'Einheit', 'eigenschaften', 'buttons' ];
    }
  }
  get hideProperties(): boolean {
    return !this.displayedColumns.includes('eigenschaften');
  }

  /** Event emitter that emits an event when the component needs to update its data */
  @Output()
  plsUpdate = new EventEmitter<number>();


  displayedColumns: string[] = [ ];

  
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
  }

  /** deletes a product from the EinkaufsListe and updates the data */
  deleteEntry(row: EinkaufsListeProdukte) {
    this.einkaufsliste.inhalt = this.einkaufsliste.inhalt.filter( e => e !== row );
    this.apiService.einkaufslisteRemoveProdukt$( this.einkaufsliste.id, row )
    .subscribe(
      (  ) => this.plsUpdate.emit(1),
      (error: HttpErrorResponse) => this.plsUpdate.emit(1)
    );
  }

  /** deletes the entire EinkaufsListe and updates the data */
  deleteShoppinglist() {
    this.apiService.einkaufslisteDelete$( this.einkaufsliste.id )
    .subscribe(
      (  ) => this.plsUpdate.emit(1),
      (error: HttpErrorResponse) => console.log(error)
    );
  }

  /** opens a dialog to create a new product and adds it to the EinkaufsListe */
  createEntry() {
    this.dialog.open(AddItemDialogComponent,{data: {einkaufsliste: this.einkaufsliste}}).afterClosed().subscribe((result: EinkaufsListeProdukte) => {
      if (result) {
        this.einkaufsliste.inhalt = this.einkaufsliste.inhalt.concat(result);
        (
          result.ekliProdId === -1 ?
          this.apiService.einkaufslisteAddProdukt$( this.einkaufsliste.id, result )
          :
          this.apiService.einkaufslisteUpdateProdukt$( this.einkaufsliste.id, result )
        )
        .subscribe(
          (  ) => this.plsUpdate.emit(1),
          (error: HttpErrorResponse) => this.plsUpdate.emit(1),
        );
      }
    });
  }

  /** opens a dialog to update an existing product and updates the data */
  updateEntry(entry: EinkaufsListeProdukte) {
    this.dialog.open(AddItemDialogComponent,{data: {einkaufsliste: this.einkaufsliste, data: Object.assign({},entry)}})
    .afterClosed().subscribe((result: EinkaufsListeProdukte) => {
      
      if (result) {
        this.apiService.einkaufslisteUpdateProdukt$( this.einkaufsliste.id, result )
        .subscribe(
          (  ) => this.plsUpdate.emit(1),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
  }

  /** opens a dialog to share the EinkaufsListe */
  shareShoppinglist(): void {
    this.dialog.open(ShareEinkaufslisteDialogComponent,{data: this.einkaufsliste}).afterClosed().subscribe((result: any) => {
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  /** Sort the Einkaufsliste table */
  sortData(sort: Sort) {
    const data = this.einkaufsliste.inhalt.slice();
    if (!sort.active || sort.direction === '') {
      this.einkaufsliste.inhalt = data;
      return;
    }

    this.einkaufsliste.inhalt = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'menge':
          return this.compare(a.menge, b.menge, isAsc);
        case 'einheit':
          return this.compare(a.einheit, b.einheit, isAsc);
        case 'istZutat':
          return this.compare(''+a.produkt.istZutat, ''+b.produkt.istZutat, isAsc);
        case 'bezeichnung':
          return this.compare(a.produkt.bezeichnung, b.produkt.bezeichnung, isAsc);
        default:
          return 0;
      }
    });
  }
}
