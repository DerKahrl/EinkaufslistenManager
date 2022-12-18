import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ApiResultHandler, ServerErrorDTO } from 'src/app/api.interface';

/**
 * The AuthService is a service to handle the authentication and session management of the app.
 * It has methods to login and check the authentication status of a user, as well as to logout and hash passwords.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionTimeValue = 30 * 60 * 60; // => 30 Minutes

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  /**
   * Check if the user is currently logged in by checking the session expiration time.
   * @returns boolean - True if the user is logged in, false otherwise.
   */
  public isLoggedIn(): boolean {
    if (Date.now() > this.getLoginExpiration()) {
      return false;
    }
    return true;
  }

  /**
   * Attempt to login the user with the given username and password.
   * If the login is successful, updates the session expiration time and calls the onResult callback.
   * If the login fails, calls the onError callback with the error message.
   * @param username - The username to login with.
   * @param password - The password to login with.
   * @param result - An object with onResult and onError callback functions.
   */
  public login(username: string, password: string, result: ApiResultHandler) {

    this.hashPassword(username,password).then(
      (passwordHashed) => {
        this.http.post<void>('/api/benutzer/authentication', { username, password: passwordHashed })
          .pipe(
            take(1),
            catchError(
              (err: HttpErrorResponse) => {
                const errorResult = {} as ServerErrorDTO;
                if ( err.error ) {

                  if ( err.error?.message ){
                    errorResult.message = err.error.message;
                  } else {
                    errorResult.message = err.message;
                  }
                  
                  if ( err.error?.reason ) {
                    errorResult.reason = err.error.reason;
                  }
                } else {
                  errorResult.message = err.message;
                }
                errorResult.status = err.status;
                result.onError(errorResult);
                throw err;
              }
            )
          )
          .subscribe(
            () => {
              this.updateSessionLastUsed();
              result.onResult();
            }
          )
      }
    );
  }

  /**
   * Check the authentication status of the user by making an API call.
   * If the user is authenticated, updates the session expiration time and redirects to the shopping list page.
   * If the user is not authenticated, clears the session storage and redirects to the login page.
   */
  public checkAuthentication(): void {
    this.http.get<void>('/api/benutzer/authentication').pipe( take(1) ).subscribe(
      () => {
        this.updateSessionLastUsed();
        this.router.navigate(['/einkaufsliste']);
      },
      () => this.setLoginExpiration(0)
    );
  }

  /**
   * Hash the given password using the SHA-512 algorithm and the given username as a salt.
   * @param username - The username to use as a salt for the password hash.
   * @param password - The password to hash.
   * @returns Promise<string> - A promise that resolves to the hashed password as a hex string.
   */
  public async hashPassword(username: string, password: string): Promise<string> {
    return this._hashPassword(password + username.toLocaleLowerCase());
  }

  /**
   * Logout the user by clearing the session storage and redirecting to the login page.
   */
  public sessionExpired() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Get the expiration time of the current session from the local storage.
   * @returns number - The expiration time of the session as a Unix timestamp.
   */
  private getLoginExpiration(): number {
    const expirationTime = localStorage.getItem('token');
    if (!expirationTime) { return 0; }
    return Number(expirationTime);
  }

  /**
   * Set the expiration time of the current session in the local storage.
   * @param expirationTime - The expiration time of the session as a Unix timestamp.
   */
  private setLoginExpiration(expirationTime: number): void {
    localStorage.setItem('token', expirationTime.toString());
  }

  /**
   * Update the session expiration time by setting it to the current time plus the session time value.
   */
  private updateSessionLastUsed() {
    this.setLoginExpiration(Date.now() + this.sessionTimeValue);
  }

  /** https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest */
  /**
   * Hash the given message using the SHA-512 algorithm.
   * @param message - The message to hash.
   * @returns Promise<string> - A promise that resolves to the hashed message as a hex string.
   */
  private async _hashPassword(message: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }
}
