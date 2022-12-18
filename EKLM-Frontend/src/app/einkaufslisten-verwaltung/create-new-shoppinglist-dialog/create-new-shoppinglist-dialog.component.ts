import { Component } from '@angular/core';
import { EinkaufsListe } from 'src/app/api.interface';

@Component({
  selector: 'app-create-new-shoppinglist-dialog',
  templateUrl: './create-new-shoppinglist-dialog.component.html',
  styleUrls: ['./create-new-shoppinglist-dialog.component.css']
})
export class CreateNewShoppinglistDialogComponent {

  public data: EinkaufsListe = {
    id: -1,
    hinweis: '',
    zeitstempel: '',
    bezeichnung: '',
    isOwner: true,
    inhalt: []
  };
  public elName: string = '';

  constructor(
    //@Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
}
