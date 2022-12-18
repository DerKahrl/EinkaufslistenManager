import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, take, UnaryFunction } from 'rxjs';
import { LoginDTO, UserInfo, EinkaufsListenInfo, EinkaufsListe, ProduktInfo, EinkaufsListeProdukte, ProduktEigenschaft, GerichtInfo } from './api.interface';
import { AuthService } from './shared/services/auth.service';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from './shared/error-snackbar/error-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
    ) { }


  private prefix = '/api';

  private defaultApiPipe<R>( observable: Observable<R> ): Observable<R> {
    return observable.pipe(
      take(1),
      catchError(
        (err: HttpErrorResponse) => {
          if ( err.status === 401 ) {
            this.authService.sessionExpired();
          } else {
            this.snackBar.openFromComponent(ErrorSnackbarComponent, {
              data: {message: err.message, httpError: err},
              duration: 10000,
              horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
              verticalPosition: 'top' as MatSnackBarVerticalPosition,
            });
          }
          throw err;
        }
      )
    );
  }
  /** Sends a request to the server to log the user out. */
  public logout$( ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/benutzer/authentication') );
  }

  /** Sends a request to the server to create a new user with the given login information. */
  public createUser$( loginDTO: LoginDTO ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/benutzer', loginDTO) );
  }

  /** Sends a request to the server to delete the user with the given id. */
  public deleteUser$( user: UserInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/benutzer/'+user.id) );
  }

  /** Sends a request to the server to update the user with the given id and login information. */
  public updateUser$( user: UserInfo, password: string ): Observable<UserInfo> {
    const loginInfo: LoginDTO = {
      username: user.username,
      password
    };
    return this.defaultApiPipe( this.http.put<UserInfo>(this.prefix+'/benutzer/'+user.id, loginInfo) );
  }

  /** Sends a request to the server to get a list of all users. */
  public getUsersAll$( ): Observable<UserInfo[]> {
    return this.defaultApiPipe( this.http.get<UserInfo[]>(this.prefix+'/benutzer') );
  }

  /** Sends a request to the server to get a list of all shopping lists for the current user. */
  public getCurrentUserShoppinglists$( ): Observable<EinkaufsListe[]> {
    return this.defaultApiPipe( this.http.get<EinkaufsListe[]>(this.prefix+'/einkaufsliste') );
  }

  public getAllProducts$( ): Observable<ProduktInfo[]> {
    return this.defaultApiPipe( this.http.get<ProduktInfo[]>(this.prefix+'/produkte') );
  }

  public productCreate$( prod: ProduktInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/produkte',prod) );
  }

  public productUpdate$( prod: ProduktInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.put<void>(this.prefix+'/produkte/'+prod.prodId,prod) );
  }

  public productDelete$( prod: ProduktInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/produkte/'+prod.prodId) );
  }

  public getAllProperties$( ): Observable<ProduktEigenschaft[]> {
    return this.defaultApiPipe( this.http.get<ProduktEigenschaft[]>(this.prefix+'/eigenschaft') );
  }

  public createProperty$( newProp: ProduktEigenschaft ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/eigenschaft',newProp) );
  }

  public deleteProperty$( prop: ProduktEigenschaft ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/eigenschaft/'+prop.eigsId) );
  }

  public updateProperty$( prop: ProduktEigenschaft ): Observable<void> {
    return this.defaultApiPipe( this.http.put<void>(this.prefix+'/eigenschaft/'+prop.eigsId,prop) );
  }

  public einkaufslisteAddProdukt$( eklID: number, produkt: EinkaufsListeProdukte ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/einkaufsliste/'+eklID+'', produkt) );
  }

  public einkaufslisteUpdateProdukt$( eklID: number, produkt: EinkaufsListeProdukte ): Observable<void> {
    return this.defaultApiPipe( this.http.put<void>(this.prefix+'/einkaufsliste/'+eklID+'/'+produkt.ekliProdId, produkt) );
  }

  public einkaufslisteRemoveProdukt$( eklID: number, produkt: EinkaufsListeProdukte ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/einkaufsliste/'+eklID+'/'+produkt.ekliProdId) );
  }

  
  public einkaufslisteCreate$( ekl: EinkaufsListe ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/einkaufsliste', ekl) );
  }

  public einkaufslisteDelete$( eklID: number ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/einkaufsliste/'+eklID) );
  }

  public einkaufslisteSharedWith$( eklID: number ): Observable<UserInfo[]> {
    return this.defaultApiPipe( this.http.get<UserInfo[]>(this.prefix+'/einkaufsliste/'+eklID+'/user') );
  }

  public einkaufslisteShareWith$( eklID: number, userToShareWith: UserInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/einkaufsliste/'+eklID+'/user',userToShareWith) );
  }
  public einkaufslisteUnshareWith$( eklID: number, user: UserInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/einkaufsliste/'+eklID+'/user/'+user.id) );
  }

  public getAllGerichte$( ): Observable<GerichtInfo[]> {
    return this.defaultApiPipe( this.http.get<GerichtInfo[]>(this.prefix+'/gerichte') );
  }

  public getGericht$( id: number ): Observable<GerichtInfo> {
    return this.defaultApiPipe( this.http.get<GerichtInfo>(this.prefix+'/gerichte/'+id) );
  }
  public gerichtCreate$( dish: GerichtInfo ): Observable<void> { 
    return this.defaultApiPipe( this.http.post<void>(this.prefix+'/gerichte',dish) );
  }
  public gerichtUpdate$( dish: GerichtInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.put<void>(this.prefix+'/gerichte/'+dish.geriId,dish) );
  }
  
  public gerichtDelete$( dish: GerichtInfo ): Observable<void> {
    return this.defaultApiPipe( this.http.delete<void>(this.prefix+'/gerichte/'+dish.geriId) );
  }
}
