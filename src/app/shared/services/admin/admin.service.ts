import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap,throwError,catchError } from 'rxjs';
import { SERVER_API_URL } from '../../../../app.constants';
import { User } from '../authauthentication/user.model';
import { Page } from '../../../modules/admin/pages/users-module/admin/list-admin/page';
import { InventoryPagination } from 'app/modules/admin/pages/users-module/admin/list-admin/admin.types';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }
getAllUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>(`${SERVER_API_URL}user/getAll`).pipe(
            tap((users) => {
                this._users.next(users); //
            }),
            catchError((error) => {
                console.error('Error fetching users', error);
                return throwError(() => new Error('Error fetching users'));
            })
        );
    }

   deleteUser(id: string): Observable<any> {
           return this._httpClient.delete(`${SERVER_API_URL}user/delete`, {
               params: new HttpParams().set('id', id),
               responseType: 'text'
           }).pipe(
               tap(() => {
                   const currentUsers = this._users.getValue() || [];
                   this._users.next(currentUsers.filter(user => user.id !== id));
               }),
               catchError((error) => {
                   console.error('Error deleting user', error);
                   return throwError(() => new Error('Error deleting user'));
               })
           );
       }

 createUser(userData: any): Observable<any> {
     const token = localStorage.getItem('accessToken'); // Récupérer le jeton
     if (!token) {
         console.error('No access token found');
         return throwError(() => new Error('No access token found'));
     }

     const headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` // Ajouter le jeton dans les en-têtes
     });

     return this._httpClient.post(`${SERVER_API_URL}user/addUser`, userData, { headers });
 }
    editUser(userData: any): Observable<any> {
        return this._httpClient.put(`${SERVER_API_URL}/user/update`, userData, {
            responseType: 'text'
        });
    }
}
