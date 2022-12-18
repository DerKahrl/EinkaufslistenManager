import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * AuthGuard is an Angular service that implements the CanActivate interface.
 * It is used to protect routes from unauthorized access by checking whether the user is logged in.
 * If the user is logged in, the canActivate method returns true, allowing the route to be accessed.
 * If the user is not logged in, the method redirects the user to the login page and returns false,
 * preventing access to the protected route.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean{
    if ( this.auth.isLoggedIn() ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
