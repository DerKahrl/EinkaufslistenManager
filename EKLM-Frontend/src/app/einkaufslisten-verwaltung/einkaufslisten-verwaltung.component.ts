import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';
import { EinkaufsListe } from '../api.interface';
import { CreateNewShoppinglistDialogComponent } from './create-new-shoppinglist-dialog/create-new-shoppinglist-dialog.component';
import { ApiService } from '../api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { PageTitleService } from '../page-title.service';

/**
 * EinkaufslistenVerwaltungComponent is a component that allows the user to manage their shopping lists.
 * It displays a list of the user's own shopping lists and a list of shopping lists shared with the user.
 * The user can create new shopping lists, add items to shopping lists, and share shopping lists with other users.
*/
@Component({
  selector: 'app-einkaufslisten-verwaltung',
  templateUrl: './einkaufslisten-verwaltung.component.html',
  styleUrls: ['./einkaufslisten-verwaltung.component.css']
})
export class EinkaufslistenVerwaltungComponent implements OnInit, OnDestroy {

  
  /** Object that represents a media query that checks if the viewport width is less than or equal to 800px. */
  mobileQuery_800px: MediaQueryList;

  /** Function that is used to listen for changes in the mobileQuery_800px media query. */
  private _mobileQueryListener: () => void;

  /** Index of the currently selected tab in the component's template. */
  public selectedTabIndex = 0;

  /** Array of EinkaufsListe objects that represents the shopping lists owned by the current user. */
  einkaufslisten: EinkaufsListe[] = [];

  /** Array of EinkaufsListe objects that represents the shopping lists shared with the current user. */
  sharedEinkaufslisten: EinkaufsListe[] = [];


  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef, 
    private media: MediaMatcher,
    private pageTitleService: PageTitleService,
    ) {
      this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();

      this.mobileQuery_800px = this.media.matchMedia('(max-width: 800px)');
      this.mobileQuery_800px.addListener(this._mobileQueryListener);

      this.updateShoppingLists();
      this.pageTitleService.setTitle('Einkaufslisten');
    }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.mobileQuery_800px.removeListener(this._mobileQueryListener);
  }

  /** Opens the Create New Shopping List dialog to create a new shopping list. */
  public createEinkaufsliste() {
    this.dialog.open(CreateNewShoppinglistDialogComponent).afterClosed().subscribe((result: EinkaufsListe) => {
      if (result) {
        this.apiService.einkaufslisteCreate$( result )
        .subscribe(
          (  ) => this.updateShoppingLists(),
          (error: HttpErrorResponse) => console.log(error)
        );
      }
    });
  }

  /** Retrieves the current user's shopping lists from the API and 
   * updates the component's einkaufslisten and sharedEinkaufslisten attributes. */
  public updateShoppingLists() {
    this.apiService.getCurrentUserShoppinglists$()
    .subscribe(
      ( result: EinkaufsListe[] ) => {
        if ( result ) {
          this.einkaufslisten       = result.filter( (value) => value.isOwner === true  );
          this.sharedEinkaufslisten = result.filter( (value) => value.isOwner === false );

          if (this.einkaufslisten.length === 0 && this.sharedEinkaufslisten.length > 0 ) {
            this.selectedTabIndex = 1;
          }
        }
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }

}
