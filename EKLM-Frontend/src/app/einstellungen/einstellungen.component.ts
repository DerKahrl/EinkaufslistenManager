import { Component, OnInit } from '@angular/core';
import { ThemeSwitchService, ThemeInfo } from '../theme-switch.service';
import { PageTitleService } from '../page-title.service';

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.component.html',
  styleUrls: ['./einstellungen.component.css']
})
export class EinstellungenComponent {

  selectedTheme: ThemeInfo | undefined;

  constructor(
    public themeService: ThemeSwitchService,
    private pageTitleService: PageTitleService,
  ) {
    this.selectedTheme = this.themeService.getCurrentTheme();
    this.pageTitleService.setTitle('Einstellungen');
  }

  public themeChanged( newTheme: ThemeInfo ) {
    this.themeService.setNewTheme(newTheme);
  }

}
