import { Component } from '@angular/core';
import { ThemeSwitchService } from './theme-switch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EKLM-Frontend';

  constructor(
    private themeService: ThemeSwitchService,
  ) {
    this.themeService.initTheme();
  }
}
