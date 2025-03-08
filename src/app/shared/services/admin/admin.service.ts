import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    InventoryPagination
} from 'app/modules/admin/pages/users-module/admin/list-admin/admin.types';
import {

    BehaviorSubject,
    Observable,
    map,
    tap,
} from 'rxjs';
import {SERVER_API_URL} from "../../../../app.constants";
import {User} from "../authauthentication/user.model";
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";

@Injectable({ providedIn: 'root' })
export class AdminService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _users: BehaviorSubject<User[] | null> =
        new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get users$ (): Observable<User[]> {
        return this._users.asObservable();
    }
    getAdmins$(role: string, page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('role', role)
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<User>>(`${SERVER_API_URL}api/user/get-by-role-pageable`, { params })
            .pipe(
                map(response => ({
                    users: response.content,
                    pagination: {
                        length: response.totalElements,
                        size: response.size,
                        page: response.number,
                        lastPage: response.totalPages - 1,
                        startIndex: response.number * response.size,
                        endIndex: Math.min((response.number + 1) * response.size, response.totalElements) - 1
                    }
                }))
            )
            .subscribe(data => {
                this._users.next(data.users);
                this._pagination.next(data.pagination);
            });
    }
    activateOrDeactivateUser(request: { userId: string; enabled: boolean }): Observable<any> {
        return this._httpClient.put(
            `${SERVER_API_URL}api/user/activate`,
            request,
            { responseType: 'text' } // Ignorer le parsing JSON
        );
    }
    deleteUser(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/user/delete`, {
            params: { id },
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._users.next(this._users.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }
    createUser(userData: any): Observable<any> {
        return this._httpClient.post(`${SERVER_API_URL}api/user/create-user`, userData);
    }
    editUser(userData: any): Observable<any> {
        return this._httpClient.put(`${SERVER_API_URL}api/user/update`, userData, {
            responseType: 'text'  // Si tu attends une réponse de type texte, utilise 'text'
        });
    }

}
