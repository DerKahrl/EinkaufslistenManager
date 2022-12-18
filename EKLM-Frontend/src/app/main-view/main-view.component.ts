import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { PageTitleService } from '../page-title.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnDestroy  {

  /** Object that is used to determine if the screen width is less than or equal to 600 pixels. */
  public mobileQuery_600px: MediaQueryList;

  /** Object that is used to determine if the screen width is less than or equal to 400 pixels. */
  public mobileQuery_400px: MediaQueryList;

  /** Function that is called when the screen width changes. It triggers a change detection update for the component. */
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private media: MediaMatcher,
    public pageTitleService: PageTitleService,
  ) {
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();

    this.mobileQuery_600px = this.media.matchMedia('(max-width: 600px)');
    this.mobileQuery_600px.addListener(this._mobileQueryListener);

    this.mobileQuery_400px = this.media.matchMedia('(max-width: 450px)');
    this.mobileQuery_400px.addListener(this._mobileQueryListener);
  }

  /** Removes the listeners for the media queries when the component is destroyed. */
  ngOnDestroy(): void {
    this.mobileQuery_600px.removeListener(this._mobileQueryListener);
    this.mobileQuery_400px.removeListener(this._mobileQueryListener);
  }
}
