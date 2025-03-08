import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../../../app.constants';
import { HttpClient, HttpParams} from '@angular/common/http';
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";
import {BehaviorSubject, Observable, map, tap , catchError, throwError} from 'rxjs';
import {InventoryPagination} from "../../../modules/admin/pages/users-module/admin/list-admin/admin.types";
import {Property} from "./property.model";
@Injectable({
    providedIn: 'root'
})
export class PropertyService {

    constructor(private _httpClient: HttpClient) {}
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _propertys: BehaviorSubject<Property[] | null> =
        new BehaviorSubject(null);

    private _propertysNames: BehaviorSubject<{ propertyId: string, propertyName: string }[] | null> = new BehaviorSubject(null);
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get propertys$ (): Observable<Property[]> {
        return this._propertys.asObservable();
    }
    getPropertysPageable$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<Property>>(`${SERVER_API_URL}api/property/properties-paginated`, { params })
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
                this._propertys.next(data.users);
                console.log("propertys", this._propertys)
                this._pagination.next(data.pagination);
            });
    }

    createProperty(formData: FormData): Observable<any> {
        return this._httpClient.post(`${SERVER_API_URL}api/property/create-property`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }
    deleteProperty(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/property/delete/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._propertys.next(this._propertys.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }

    updateProperty(formData: FormData): Observable<any> {
        return this._httpClient.put(`${SERVER_API_URL}api/property/update`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }

    getPropertyById(propertieId: string): Observable<any> {
        return this._httpClient.get(`${SERVER_API_URL}api/property/propertie/${propertieId}`);
    }

    get PropertysNames$(): Observable<{propertyId: string, propertyName: string }[]> {
        console.log("this._propertysNames",this._propertysNames)
        return this._propertysNames.asObservable();
    }
    getAllPropertysNames$(): void {
        this._httpClient.get<{ propertyId: string, propertyName: string }[]>(`${SERVER_API_URL}api/property/properties`)
            .pipe(
                map(response => response || []),
                catchError(error => {
                    console.error("❌ Erreur lors de la récupération des noms des services", error);
                    return throwError(() => new Error("Impossible de récupérer les services."));
                })
            )
            .subscribe(propertys => this._propertysNames.next(propertys));
    }
    getAllPropertysNamess$(): void {
        this._httpClient.get<{ propertyId: string, propertyName: string }[]>(`${SERVER_API_URL}api/properties`)
            .subscribe(data => {
                this._propertysNames.next(data);
            });
    }
}
