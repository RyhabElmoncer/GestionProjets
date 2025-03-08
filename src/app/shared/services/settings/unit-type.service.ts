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
    catchError,
    throwError
} from 'rxjs';
import {SERVER_API_URL} from "../../../../app.constants";
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";
import {UnitType} from "./unit-type.model";

@Injectable({ providedIn: 'root' })
export class UnitTypeService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _unitTypes: BehaviorSubject<UnitType[] | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}


    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get unitTypes$ (): Observable<UnitType[]> {
        return this._unitTypes.asObservable();
    }
    getUnitTypes$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<UnitType>>(`${SERVER_API_URL}api/unit-type/get-AllunitType-paginated`, { params })
            .pipe(
                map(response => ({
                    unitTypes: response.content,
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
                this._unitTypes.next(data.unitTypes);
                this._pagination.next(data.pagination);
            });
    }

    deleteUnitType(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/unit-type/delete-unitType/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._unitTypes.next(this._unitTypes.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }
    createUnitType(unitType: UnitType): Observable<UnitType> {
        return this._httpClient.post<UnitType>(`${SERVER_API_URL}api/unit-type/create-unitType`, unitType).pipe(
            tap((newUnitType) => {
                // Ajouter le service créé à la liste actuelle
                const currentUnitTypes = this._unitTypes.getValue() ?? [];
                this._unitTypes.next([newUnitType, ...currentUnitTypes]);
            })
        );
    }
    editUnitType(unitType: UnitType): Observable<UnitType> {
        return this._httpClient.put<UnitType>(`${SERVER_API_URL}api/unit-type/update-unitType`, unitType).pipe(
            tap((updatedUnitType) => {
                // Récupérer la liste actuelle des UnitTypes
                const currentUnitTypes = this._unitTypes.getValue() ?? [];

                // Mettre à jour l'élément modifié
                const updatedUnitTypes = currentUnitTypes.map(s =>
                    s.id === updatedUnitType.id ? updatedUnitType : s
                );


                // Mettre à jour l'Observable
                this._unitTypes.next(updatedUnitTypes);
            })
        );
    }
    getAllUnitTypes$(): void {
        this._httpClient.get<UnitType[]>(`${SERVER_API_URL}api/unit-type/get-unitType`)
            .subscribe(unitTypes => {
                this._unitTypes.next(unitTypes);
            });
    }


}
