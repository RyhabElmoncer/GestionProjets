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
import {ServiceInclusion} from "./serviceInclusion.model";

@Injectable({ providedIn: 'root' })
export class InclusionsService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _inclusions: BehaviorSubject<ServiceInclusion[] | null> =
        new BehaviorSubject(null);
    private _inclusionsNames: BehaviorSubject<{ id: string, name: string }[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}


    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get inclusions$ (): Observable<ServiceInclusion[]> {
        return this._inclusions.asObservable();
    }
    getInclusions$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<ServiceInclusion>>(`${SERVER_API_URL}api/inclusions/get-Allinclusions-paginated`, { params })
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
                this._inclusions.next(data.users);
                this._pagination.next(data.pagination);
            });
    }

    deleteInclusion(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/inclusions/delete-inclusion/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._inclusions.next(this._inclusions.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }
    createInclusion(service: ServiceInclusion): Observable<ServiceInclusion> {
        return this._httpClient.post<ServiceInclusion>(`${SERVER_API_URL}api/inclusions/create-inclusion`, service).pipe(
            tap((newService) => {
                // Ajouter le service créé à la liste actuelle
                const currentInclusions = this._inclusions.getValue() ?? [];
                this._inclusions.next([newService, ...currentInclusions]);
            })
        );
    }
    editInclusion(service: ServiceInclusion): Observable<ServiceInclusion> {
        return this._httpClient.put<ServiceInclusion>(`${SERVER_API_URL}api/inclusions/update-inclusion`, service).pipe(
            tap((updatedService) => {
                // Récupérer la liste actuelle des Inclusions
                const currentInclusions = this._inclusions.getValue() ?? [];

                // Mettre à jour l'élément modifié
                const updatedInclusions = currentInclusions.map(s =>
                    s.id === updatedService.id ? updatedService : s
                );

                // Mettre à jour l'Observable
                this._inclusions.next(updatedInclusions);
            })
        );
    }
    get inclusionsNames$(): Observable<{ id: string, name: string }[]> {
        console.log("this._inclusionsNames",this._inclusionsNames)
        return this._inclusionsNames.asObservable();
    }
    getAllInclusionsNames$(): void {
        this._httpClient.get<{ id: string, name: string }[]>(`${SERVER_API_URL}api/inclusions/get-all-InclusionsNames`)
            .pipe(
                map(response => response || []),
                catchError(error => {
                    console.error("❌ Erreur lors de la récupération des noms des services", error);
                    return throwError(() => new Error("Impossible de récupérer les services."));
                })
            )
            .subscribe(inclusions => this._inclusionsNames.next(inclusions));
    }


}
