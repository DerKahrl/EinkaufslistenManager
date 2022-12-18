import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: './toolbar-menu.component.html',
  styleUrls: ['./toolbar-menu.component.css']
})
export class ToolbarMenuComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  benutzer(): void {
    this.router.navigate(['/benutzer']);
  }

  settings() {
    this.router.navigate(['/einstellungen']);
  }

  logout(): void {
    this.apiService.logout$()
    .subscribe(
      () => {
        window.sessionStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      () => {
        window.sessionStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    )
  }

}
