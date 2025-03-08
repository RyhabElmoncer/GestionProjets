import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../../../../app.constants';
import { HttpClient, HttpParams} from '@angular/common/http';
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";
import {BehaviorSubject, Observable, catchError, map, tap, of} from 'rxjs';
import {InventoryPagination} from "../../../modules/admin/pages/users-module/admin/list-admin/admin.types";
import {Unit} from "./unit.model";
import {ServiceInclusion} from "../settings/serviceInclusion.model";
@Injectable({
    providedIn: 'root'
})
export class UnitService {

    constructor(private _httpClient: HttpClient) {}
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _units: BehaviorSubject<Unit[] | null> =
        new BehaviorSubject(null);
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get units$ (): Observable<Unit[]> {
        return this._units.asObservable();
    }
    getUnitsPageable$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<Unit>>(`${SERVER_API_URL}api/unity/units-paginated`, { params })
            .pipe(
                map(response => ({
                    units: response.content,
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
                this._units.next(data.units);
                console.log("units", this._units)
                this._pagination.next(data.pagination);
            });
    }

    createUnit(formData: FormData): Observable<any> {
        return this._httpClient.post(`${SERVER_API_URL}api/unity/create-unity`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }
    deleteUnit(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/unity/delete/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._units.next(this._units.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }

    updateUnit(formData: FormData): Observable<any> {
        return this._httpClient.put(`${SERVER_API_URL}api/unity/update-unit`, formData, {
            reportProgress: true,
            observe: 'response',
            responseType: 'text'
        });
    }
    getUnitsByPropertyId(propertyId: string): void {
        this._httpClient.get<Unit[]>(`${SERVER_API_URL}api/unity/property/${propertyId}`)
            .subscribe(units => {
                if (Array.isArray(units)) {
                    this._units.next(units);
                } else {
                    console.warn('Received non-array data for units:', units);
                    this._units.next([]); // fallback to empty array
                }
            });
    }
    getServicesByUnitId(unitId: string): Observable<{ id: string, name: string }[]> {
        return this._httpClient.get<Unit[]>(`${SERVER_API_URL}api/unity/${unitId}/services`).pipe(
            map(units => {
                // Assuming your 'Unit' has the 'id' and 'name' properties, map the units to the expected format
                return units.map(unit => ({
                    id: unit.id,   // Ensure your 'Unit' has the 'id' property
                    name: unit.name  // Ensure your 'Unit' has the 'name' property
                }));
            }),
            catchError(error => {
                console.error('❌ Error fetching services:', error);
                return of([]);  // Return an empty array in case of error
            })
        );
    }


    getInclusionByUnitId(unitId: string): Observable<{ id: string, qty: string, other: string }[]> {
        return this._httpClient.get<{ id: string, qty: string, other: string }[]>(`${SERVER_API_URL}api/unity/${unitId}/inclusions`).pipe(
            map(inclusions => {
                // Directly return the inclusion objects, ensuring the fields match the expected structure
                return inclusions.map(inclusion => ({
                    id: inclusion.id,    // Map 'id' field
                    qty: inclusion.qty,  // Map 'qty' field
                    other: inclusion.other // Map 'other' field
                }));
            }),
            catchError(error => {
                console.error('❌ Error fetching inclusions:', error);
                return of([]);  // Return an empty array in case of error
            })
        );
    }



}
