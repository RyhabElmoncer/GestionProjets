import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { SERVER_API_URL } from '../../../../app.constants';
import { User } from '../../../core/user/user.types';


@Injectable({providedIn: 'root'})

export class AuthauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    // public LoginStatus: Observable<boolean>;
    private loginStatus = new BehaviorSubject<boolean>(this.chekLogin());

    constructor(private http: HttpClient,
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(login: any) {
        /*return this.http.post<any>(`/users/authenticate`, { email, password })*/
        return this.http.post<any>(SERVER_API_URL + 'api/auth/authenticate', login)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.id_token) {
                    this.loginStatus.next(true);
                    localStorage.setItem('loginStatus', '1');
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('authenticationToken', user.id_token);
                    this.currentUserSubject.next(user);
                    if (login.rememberMe) {
                        localStorage.setItem('authenticationToken', user.id_token);
                    } else {
                        sessionStorage.setItem('authenticationToken', user.id_token);
                    }

       
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.clear();
        // sessionStorage.clear();
        this.loginStatus.next(false);
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    chekLogin(): boolean {
        const loginStatus = localStorage.getItem('loginStatus');
        if (loginStatus) {
            return true;
        }
        return false;
    }


    get isLoggedIn() {
        return this.loginStatus.asObservable();
    }


}
