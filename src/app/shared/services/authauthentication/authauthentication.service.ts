import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../../../../app.constants';
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient) {}


    decodeToken(token: string): any {
        try {
            return jwtDecode<JwtPayload>(token);
        } catch (error) {
            console.error('Invalid token', error);
            return null;
        }
    }

    // Récupérer une information spécifique (ex : uuid) depuis le token
    getClaim(token: string, claim: string): any {
        const decoded = this.decodeToken(token);
        return decoded ? decoded[claim] : null;
    }
    getUserById(id: string): Observable<any> {
        return this.http.get(`${SERVER_API_URL}api/user/get-by-id`, { params: { id } });
    }
}
