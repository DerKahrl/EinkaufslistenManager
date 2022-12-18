import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainViewComponent } from './main-view/main-view.component';
import { BenutzerVerwaltungComponent } from './benutzer-verwaltung/benutzer-verwaltung.component';
import { EinkaufslistenVerwaltungComponent } from './einkaufslisten-verwaltung/einkaufslisten-verwaltung.component';
import { GerichteVerwaltungComponent } from './gerichte/gerichte-verwaltung/gerichte-verwaltung.component';
import { ProdukteVerwaltungComponent } from './gerichte/produkte-verwaltung/produkte-verwaltung.component';
import { ViewGerichtComponent } from './gerichte/gerichte-verwaltung/view-gericht/view-gericht.component';
import { EigenschaftenVerwaltungComponent } from './gerichte/eigenschaften-verwaltung/eigenschaften-verwaltung.component';
import { AuthGuard } from './shared/services/auth.guard';
import { EigenschaftenPriorisierungComponent } from './gerichte/eigenschaften-verwaltung/eigenschaften-priorisierung/eigenschaften-priorisierung.component';
import { EinstellungenComponent } from './einstellungen/einstellungen.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: MainViewComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'benutzer',       component: BenutzerVerwaltungComponent        },
      { path: 'einkaufsliste',  component: EinkaufslistenVerwaltungComponent  },
      { path: 'produkte',       component: ProdukteVerwaltungComponent        },
      { path: 'eigenschaften',  component: EigenschaftenVerwaltungComponent   },
      { path: 'eigenschaften/prio',  component: EigenschaftenPriorisierungComponent   },
      { path: 'gerichte',       component: GerichteVerwaltungComponent        },
      { path: 'gerichte/:id',   component: ViewGerichtComponent               },
      { path: 'einstellungen',  component: EinstellungenComponent             },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
