import { Injectable } from '@angular/core';

export interface ThemeInfo {
  name: string;
  classname: string;
}

/** Service for switching between different themes. */
@Injectable({
  providedIn: 'root'
})
export class ThemeSwitchService {

  public themes = [
    {name: 'Light', classname:'light-theme'},
    {name: 'Dark',  classname:'dark-theme' },
  ];

  public initTheme(): void {
    const selectedTheme = window.sessionStorage.getItem('theme');
    if ( selectedTheme != null ) {
      this.setNewThemeClass( selectedTheme );
    }
  }

  public resetTheme(): void {
    this.setNewTheme(this.themes[0]);
    window.sessionStorage.removeItem('theme');
  }

  public getCurrentTheme(): ThemeInfo | undefined {
    return this.themes.find( v=> v.classname === this.getActiveThemes()[0] );
  }

  public setNewTheme(themeName: ThemeInfo) {
    this.setNewThemeClass(themeName.classname);
  }

  private setNewThemeClass(themeName: string) {
    this.getActiveThemes().forEach(
      oldTheme => document.body.classList.remove(oldTheme)
    );
    document.body.classList.add(themeName);
    window.sessionStorage.setItem('theme',themeName);
  }

  private getActiveThemes(): string[] {
    const activeThemes: string[] = [];
    document.body.classList.forEach( v => { if ( v.endsWith('theme')) { activeThemes.push(v) } } );
    return activeThemes;
  }
}
