import { inject, Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject, of} from 'rxjs';
import {shareReplay, tap, catchError} from 'rxjs/operators';
import {SERVER_API_URL} from '../../../app.constants';
import {Account} from './account.model';
import { StateStorageService } from './state-storage.service';


@Injectable({providedIn: 'root'})
export class AccountService {
    private router = inject(Router) ;
    private http = inject(HttpClient);
    private stateStorageService = inject(StateStorageService);
    private userIdentity: Account | null = null;
    private authenticationState = new ReplaySubject<Account | null>(1);
    private accountCache$?: Observable<Account | null>;



    /**
     * create user
     * @param account
     */
    save(account: any): Observable<{}> {
        return this.http.post(SERVER_API_URL + 'api/account', account);
    }

    /**
     * reset Password
     * @param mail
     */
    resetPassword(mail: string): Observable<{}> {
        return this.http.post(SERVER_API_URL + 'api/account/reset-password/init', mail);
    }

    /**
     * authenticate
     * @param identity
     */
    authenticate(identity: Account | null): void {
        this.userIdentity = identity;
        this.authenticationState.next(this.userIdentity);
    }

    /**
     * has Any Authority
     * @param authorities
     */
    hasAnyAuthority(authorities: string[] | string): boolean {

        if (!this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }
        if (!Array.isArray(authorities)) {
            authorities = [authorities];
        }
        this.identity().subscribe(account => {
            if (account) {
                console.log('account', account.authorities.some((authority: string) => authorities.includes(authority)));
                return account.authorities.some((authority: string) => authorities.includes(authority));
            }

        });

    }

    /**
     * identity
     * @param force
     */
    identity(force?: boolean): Observable<Account | null> {

        if (!this.accountCache$ || force || !this.isAuthenticated()) {
            this.accountCache$ = this.fetch().pipe(
                catchError(() => {
                    return of(null);
                }),
                tap((account: Account | null) => {
                    console.log("account" , account)
                    this.authenticate(account);
                    // After retrieve the account info, the language will be changed to
                    // the user's preferred language configured in the account setting
                    if (account && account.langKey) {
                        const langKey = localStorage.getItem('lang') || account.langKey;
                        //this.languageService.changeLanguage(langKey);
                    }

                    if (account) {
                        this.navigateToStoredUrl();
                    }
                }),
                shareReplay(),
            );
        }
        return this.accountCache$;
    }


    /**
     * is Authenticated
     */
    isAuthenticated(): boolean {
        return this.userIdentity !== null;
    }

    /**
     * get Authentication State
     */
    getAuthenticationState(): Observable<Account | null> {
        return this.authenticationState.asObservable();
    }

    /**
     * get Image Url
     */
    getImageUrl(): string {
        return this.userIdentity ? this.userIdentity.imageUrl : '';
    }

    private fetch(): Observable<any> {
        return this.http.get<any>(SERVER_API_URL + 'api/account');
    }

    /**
     * navigate To Stored Url
     * @private
     */
    private navigateToStoredUrl(): void {
        // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
        // if login is successful, go to stored previousState and clear previousState
        const previousUrl = this.stateStorageService.getUrl();
        if (previousUrl) {
            this.stateStorageService.clearUrl();
            this.router.navigateByUrl(previousUrl);
        }
    }





}
