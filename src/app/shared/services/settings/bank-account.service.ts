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
import {BankAccount} from "./bank-account.model";

@Injectable({ providedIn: 'root' })
export class BankAccountService {
    // Private
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    public _bankAccounts: BehaviorSubject<BankAccount[] | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}


    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get bankAccounts$ (): Observable<BankAccount[]> {
        return this._bankAccounts.asObservable();
    }
    getBankAccounts$(page: number = 0, size: number = 20): void {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        this._httpClient.get<Page<BankAccount>>(`${SERVER_API_URL}api/bank_account/get-AllbankAccount-paginated`, { params })
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
                this._bankAccounts.next(data.unitTypes);
                this._pagination.next(data.pagination);
            });
    }

    deleteBankAccount(id: string): Observable<any> {
        return this._httpClient.delete(`${SERVER_API_URL}api/bank_account/delete-bankAccount/${id}`, {
            responseType: 'text' // Dit à Angular de ne pas attendre un JSON
        }).pipe(
            tap(() => {
                this._bankAccounts.next(this._bankAccounts.getValue()?.filter(u => u.id !== id) ?? []);
            })
        );
    }
    createBankAccount(bankAccount: BankAccount): Observable<BankAccount> {
        return this._httpClient.post<BankAccount>(`${SERVER_API_URL}api/bank_account/create-bankAccount`, bankAccount).pipe(
            tap((newBankAccount) => {
                // Ajouter le BankAccount créé à la liste actuelle
                const currentBankAccounts = this._bankAccounts.getValue() ?? [];
                this._bankAccounts.next([newBankAccount, ...currentBankAccounts]);
            })
        );
    }
    editBankAccount(bankAccount: BankAccount): Observable<BankAccount> {
        return this._httpClient.put<BankAccount>(`${SERVER_API_URL}api/bank_account/update-bankAccount`, bankAccount).pipe(
            tap((updatedBankAccount) => {
                // Récupérer la liste actuelle des bankAccounts
                const currentBankAccounts = this._bankAccounts.getValue() ?? [];

                // Mettre à jour l'élément modifié
                const updatedBankAccounts = currentBankAccounts.map(s =>
                    s.id === updatedBankAccount.id ? updatedBankAccount : s
                );

                // Mettre à jour l'Observable
                this._bankAccounts.next(updatedBankAccounts);
            })
        );
    }
}
