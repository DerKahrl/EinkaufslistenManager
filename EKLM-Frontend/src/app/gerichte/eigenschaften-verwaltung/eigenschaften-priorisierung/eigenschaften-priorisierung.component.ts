import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from 'src/app/api.service';
import { ProduktEigenschaft } from 'src/app/api.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'src/app/page-title.service';

@Component({
  selector: 'app-eigenschaften-priorisierung',
  templateUrl: './eigenschaften-priorisierung.component.html',
  styleUrls: ['./eigenschaften-priorisierung.component.css']
})
export class EigenschaftenPriorisierungComponent {

  /** Properties sorted by compare groups */
  vergleichsGruppen: ProduktEigenschaft[][] = [];

  /** Properties that don't have compare groups */
  eigenschaftenOhneVG: ProduktEigenschaft[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private pageTitleService: PageTitleService,
  ) {
    this.loadPropertiesFromServer();
    this.pageTitleService.setTitle('Eigenschaften Vergleich & Prio');
  }

  clickedNewGroup() {
    this.vergleichsGruppen.push([]);
  }

  getVgID(vg: ProduktEigenschaft[]) {
    return this.vergleichsGruppen.indexOf(vg);
  }

  filterVG( vgs: ProduktEigenschaft[][] ) {
    return vgs.filter( v => v != null )
  }

  /** Handle drag & drop operation */
  drop(event: CdkDragDrop<ProduktEigenschaft[]>) {

    if (event.previousContainer === event.container) {
      // Nur reihenfolge geändert:
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((v, i) => {
        v.prio = i;
        this.apiService.updateProperty$(v).subscribe();
      });

    } else {
      // Element von einem Container in den anderen verschoben:
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const fromVG = this.getVgID(event.previousContainer.data);
      if (fromVG !== -1) {
        // Wenn es aus einer anderen Vergleichsgruppe kommt,
        // dort die prio liste aktualisieren jetzt wo ein Element fehlt.
        event.previousContainer.data.forEach((v, i) => {
          v.prio = i;
          this.apiService.updateProperty$(v).subscribe();

        });
      }
      const toVG = this.getVgID(event.container.data);
      if (toVG !== -1) {
        // Update der Vergleichsgruppe in welche das Element reingeschoben wurde:
        event.container.data.forEach((v, i) => {
          v.prio = i;
          v.vergleichsGruppe = toVG;
          this.apiService.updateProperty$(v).subscribe();
        });
      } else {
        // Eigenschaft nach 'Ohne Gruppe' verschoben
        const elment = event.container.data[event.currentIndex];
        elment.vergleichsGruppe = -1;
        elment.prio = -1;
        this.apiService.updateProperty$(elment).subscribe();
      }
    }
  }

  /** Load all ProduktEigenschaft from server and sort them based on vergleichsGruppe and prio */
  private loadPropertiesFromServer() {
    this.apiService.getAllProperties$()
      .subscribe(
        (result: ProduktEigenschaft[]) => {
          this.vergleichsGruppen = result
            .filter(v => v.vergleichsGruppe >= 0 && v.prio >= 0)
            .reduce<ProduktEigenschaft[][]>(
              (rv, x) => {
                (rv[x.vergleichsGruppe] = rv[x.vergleichsGruppe] || []).push(x);
                return rv;
              },
              []
            )
            .map(v => v.sort((a, b) => a.prio - b.prio));

          this.eigenschaftenOhneVG = result.filter(v => v.vergleichsGruppe === -1 || v.prio === -1)
        },
        (error: HttpErrorResponse) => console.log(error)
      );
  }
}
