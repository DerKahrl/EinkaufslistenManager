import { Component, OnInit, Inject } from '@angular/core';
import { ProduktEigenschaft } from 'src/app/api.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-eigenschaft-dialog',
  templateUrl: './create-eigenschaft-dialog.component.html',
  styleUrls: ['./create-eigenschaft-dialog.component.css']
})
export class CreateEigenschaftDialogComponent {

  eigenschaft: ProduktEigenschaft = {
    eigsId: -1,
    bezeichnung: '',
    vergleichsGruppe: -1,
    prio: -1,
    anzeigen: true,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: ProduktEigenschaft,
  ) {
    if ( this.dialogData ) {
      this.eigenschaft = Object.assign({},this.dialogData);
    }
  }
}
