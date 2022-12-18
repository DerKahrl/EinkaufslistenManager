import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { BenutzerVerwaltungComponent } from './benutzer-verwaltung/benutzer-verwaltung.component';
import { EinkaufslistenVerwaltungComponent } from './einkaufslisten-verwaltung/einkaufslisten-verwaltung.component';
import { GerichteVerwaltungComponent } from './gerichte/gerichte-verwaltung/gerichte-verwaltung.component';
import { ProdukteVerwaltungComponent } from './gerichte/produkte-verwaltung/produkte-verwaltung.component';
import { MainViewComponent } from './main-view/main-view.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from 'src/material.module';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreateUserDialogComponent } from './benutzer-verwaltung/create-user-dialog/create-user-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { AddItemDialogComponent } from './einkaufslisten-verwaltung/add-item-dialog/add-item-dialog.component';
import { EinkaufslisteComponent } from './einkaufslisten-verwaltung/einkaufsliste/einkaufsliste.component';
import { CreateNewShoppinglistDialogComponent } from './einkaufslisten-verwaltung/create-new-shoppinglist-dialog/create-new-shoppinglist-dialog.component';
import { CreateNewProductComponent } from './gerichte/produkte-verwaltung/create-new-product/create-new-product.component';
import { ViewGerichtComponent } from './gerichte/gerichte-verwaltung/view-gericht/view-gericht.component';
import { CreateNewGerichtDialogComponent } from './gerichte/gerichte-verwaltung/create-new-gericht-dialog/create-new-gericht-dialog.component';
import { AddToShoppinglistComponent } from './gerichte/gerichte-verwaltung/view-gericht/add-to-shoppinglist/add-to-shoppinglist.component';
import { EigenschaftenVerwaltungComponent } from './gerichte/eigenschaften-verwaltung/eigenschaften-verwaltung.component';
import { CreateEigenschaftDialogComponent } from './gerichte/eigenschaften-verwaltung/create-eigenschaft-dialog/create-eigenschaft-dialog.component';
import { ShareEinkaufslisteDialogComponent } from './einkaufslisten-verwaltung/share-einkaufsliste-dialog/share-einkaufsliste-dialog.component';
import { ErrorSnackbarComponent } from './shared/error-snackbar/error-snackbar.component';
import { EigenschaftenPriorisierungComponent } from './gerichte/eigenschaften-verwaltung/eigenschaften-priorisierung/eigenschaften-priorisierung.component';
import { EinstellungenComponent } from './einstellungen/einstellungen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BenutzerVerwaltungComponent,
    EinkaufslistenVerwaltungComponent,
    GerichteVerwaltungComponent,
    ProdukteVerwaltungComponent,
    MainViewComponent,
    ToolbarMenuComponent,
    CreateUserDialogComponent,
    AddItemDialogComponent,
    EinkaufslisteComponent,
    CreateNewShoppinglistDialogComponent,
    CreateNewProductComponent,
    ViewGerichtComponent,
    CreateNewGerichtDialogComponent,
    AddToShoppinglistComponent,
    EigenschaftenVerwaltungComponent,
    CreateEigenschaftDialogComponent,
    ShareEinkaufslisteDialogComponent,
    ErrorSnackbarComponent,
    EigenschaftenPriorisierungComponent,
    EinstellungenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
