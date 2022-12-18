import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private title: Subject<string> = new Subject<string>();

  public setTitle( newTitle: string ) {
    this.title.next( newTitle );
  }

  public getTitle(): Subject<string> {
    return this.title;
  }

  constructor() { }
}
