import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { SERVER_API_URL } from '../../../app.constants';
import { AccountService } from '../user/account.service';
import { AuthauthenticationService } from '../../shared/services/auth/auth.authentication.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _router = inject(Router) ;
    private _translocoService = inject( TranslocoService);
    private _accountService= inject(AccountService);
    public _authFackservice = inject(AuthauthenticationService)

    constructor()
    {
        // this._accountService.identity().subscribe(user => {
        //
        // }, ()=> {
        //     localStorage.setItem('user', null);
        //     this._authFackservice.logout();
        //     sessionStorage.removeItem('authenticationToken');
        //     //   localStorage.clear();
        //     this._accountService.authenticate(null);
        //     this._router.navigate(['/sign-out']);
        //
        // });

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    authenticate(email: string, password: string): Observable<any> {
        const body = { email, password };

        return this._httpClient.post(`${SERVER_API_URL}api/auth/authenticate`, body).pipe(
            tap((response: any) => {
                // Enregistrer le token dans le localStorage
                console.log("accessToken1", this.accessToken);
                this.accessToken = response.token;
                this._authenticated = true;
                console.log("response.token2", this.accessToken);
            })
        );
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password (not updated)
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password (not updated)
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */

    // signIn(credentials: { email: string; password: string }): Observable<any>
    // {
    //     // Throw error, if the user is already logged in
    //     if ( this._authenticated )
    //     {
    //         return throwError('User is already logged in.');
    //     }
    //     const model = {
    //         username: credentials.email,
    //         password: credentials.password,
    //         rememberMe: false
    //     };
    //     return this._httpClient.post(SERVER_API_URL + 'api/auth/authenticate', model).pipe(
    //         switchMap((response: any) => {
    //             // Store the access token in the local storage
    //             this.accessToken = response.id_token;
    //             this._accountService.identity().subscribe( user  =>  {
    //                 if(user) {
    //                     this._accountService.authenticate(user);
    //                     localStorage.setItem('locale', user.langKey);
    //                     localStorage.setItem('lang', user.langKey);
    //                     this._translocoService.setActiveLang(user.langKey);
    //                     localStorage.setItem('currentUser', JSON.stringify(user));
    //                     localStorage.setItem('user', JSON.stringify(user));
    //                     this._userService.user = user;
    //                 }
    //             })
    //
    //             // Set the authenticated flag to true
    //             this._authenticated = true;
    //
    //             // Store the user on the user service
    //
    //
    //             // Return a new observable with the response
    //             return of(response);
    //         })
    //     );
    // }

    /**
     * Sign in using the access token (not updated)
     */
    // signInUsingToken(): Observable<any> {
    //     // Sign in using the token
    //     return this._httpClient
    //         .post('api/auth/sign-in-with-token', {
    //             accessToken: this.accessToken,
    //         })
    //         .pipe(
    //             catchError(() =>
    //                 // Return false
    //                 of(false)
    //             ),
    //             switchMap((response: any) => {
    //                 // Replace the access token with the new one if it's available on
    //                 // the response object.
    //                 //
    //                 // This is an added optional step for better security. Once you sign
    //                 // in using the token, you should generate a new one on the server
    //                 // side and attach it to the response object. Then the following
    //                 // piece of code can replace the token with the refreshed one.
    //                 if (response.accessToken) {
    //                     this.accessToken = response.accessToken;
    //                 }
    //
    //                 // Set the authenticated flag to true
    //                 this._authenticated = true;
    //
    //                 // Store the user on the user service
    //                 this._userService.user = response.user;
    //
    //                 // Return true
    //                 return of(true);
    //             })
    //         );
    // }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.clear();
        localStorage.setItem("lang", "en");
        localStorage.setItem("locale", "en");
        this._accountService.authenticate(null);
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up (not updated)
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session (not updated)
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status (not updated)
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return of(true);
    }
}
