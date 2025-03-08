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
export class ServiceService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _services: BehaviorSubject<ServiceInclusion[] | null> =
        new BehaviorSubject(null);
    private _servicesNames: BehaviorSubject<{ id: string, name: string }[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    get services$(): Observable<ServiceInclusion[]> {
        return this._services.asObservable();
    }

    getServices$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<ServiceInclusion>>(`${SERVER_API_URL}api/services/get-Allservice-paginated`, {params})
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
                this._services.next(data.users);
                this._pagination.next(data.pagination);
            });
    }
    deleteService(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/services/delete-service/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._services.next(this._services.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }
    createService(service: ServiceInclusion): Observable<ServiceInclusion> {
        return this._httpClient.post<ServiceInclusion>(`${SERVER_API_URL}api/services/create-Service`, service).pipe(
            tap((newService) => {
                // Ajouter le service créé à la liste actuelle
                const currentServices = this._services.getValue() ?? [];
                this._services.next([newService, ...currentServices]);
            })
        );
    }
    editService(service: ServiceInclusion): Observable<ServiceInclusion> {
        return this._httpClient.put<ServiceInclusion>(`${SERVER_API_URL}api/services/update-service`, service).pipe(
            tap((updatedService) => {
                // Récupérer la liste actuelle des services
                const currentServices = this._services.getValue() ?? [];

                // Mettre à jour l'élément modifié
                const updatedServices = currentServices.map(s =>
                    s.id === updatedService.id ? updatedService : s
                );
                // Mettre à jour l'Observable
                this._services.next(updatedServices);
            })
        );
    }
    get servicesNames$(): Observable<{ id: string, name: string }[]> {
        console.log("this._servicesNames",this._servicesNames)
        return this._servicesNames.asObservable();
    }
    getAllServicesNames$(): void {
        this._httpClient.get<{ id: string, name: string }[]>(`${SERVER_API_URL}api/services/get-all-ServicesNames`)
            .pipe(
                map(response => response || []),
                catchError(error => {
                    console.error("❌ Erreur lors de la récupération des noms des services", error);
                    return throwError(() => new Error("Impossible de récupérer les services."));
                })
            )
            .subscribe(services => this._servicesNames.next(services));
    }

}
