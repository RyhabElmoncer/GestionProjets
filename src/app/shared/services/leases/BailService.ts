import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../../../app.constants';
import { HttpClient, HttpParams} from '@angular/common/http';
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";
import {BehaviorSubject, Observable, map, tap} from 'rxjs';
import {InventoryPagination} from "../../../modules/admin/pages/users-module/admin/list-admin/admin.types";
import {Bails} from "./Bails";
@Injectable({
    providedIn: 'root'
})
export class BailsService {

    constructor(private _httpClient: HttpClient) {}
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _Bailss: BehaviorSubject<Bails[] | null> =
        new BehaviorSubject(null);
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get Bailsss$ (): Observable<Bails[]> {
        return this._Bailss.asObservable();
    }
    getBailsPageable$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<Bails>>(`${SERVER_API_URL}api/bails/paginated`, { params })
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
                this._Bailss.next(data.users);
                console.log("Bailss", this._Bailss)
                this._pagination.next(data.pagination);
            });
    }

    createBails(formData: FormData): Observable<any> {
        return this._httpClient.post(`${SERVER_API_URL}api/Bails/create-Bails`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }
    deleteBails(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/Bails/delete/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._Bailss.next(this._Bailss.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }

    updateBails(formData: FormData): Observable<any> {
        return this._httpClient.put(`${SERVER_API_URL}api/Bails/update`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }

    getBailsById(propertieId: string): Observable<any> {
        return this._httpClient.get(`${SERVER_API_URL}api/Bails/propertie/${propertieId}`);
    }

}
