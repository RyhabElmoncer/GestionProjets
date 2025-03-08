import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';


import { IUser } from './user.model';

import Swal from 'sweetalert2';

import {catchError} from 'rxjs/operators';

import {SERVER_API_URL} from '../../../../app.constants';
import {createRequestOption, Pagination} from '../../util/request-util';
import {User} from "../authauthentication/user.model";
import {Page} from "../../../modules/admin/pages/users-module/admin/list-admin/page";
type EntityArrayResponseType = HttpResponse<any[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }

    find(login: string): Observable<any> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(catchError(e => {
          Swal.fire({
            icon: 'info',
            title: 'Network Error',
            text: 'the operation couldn\'t be completed.',
          });
          return throwError(e);
        })
    );
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`).pipe(catchError(e => {
            Swal.fire({
                icon: 'info',
                title: 'Alert',
                text: 'This object was not deleted because there is a relationship with the other object.',
            });
            return throwError(e);
        })
    );
  }



    /**
     * Search by key
     * @param req
     * @param attribute
     */
    search(req?: any, attribute?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.post<any[]>(`${this.resourceUrl}/searchBackOffice`, attribute, { params: options, observe: 'response'}).pipe(
            catchError(e => {
                Swal.fire({
                    icon: 'info',
                    title: 'Network Error',
                    text: 'the operation couldn\'t be completed.',
                });
                return throwError(e);
            })
        );
    }
    /**
     * new code
     */

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${SERVER_API_URL}api/user/get-all`);
    }
    getAllUsersNames(): Observable<User[]> {
        return this.http.get<User[]>(`${SERVER_API_URL}api/user/get-list-users-name`);
    }
    getUserCount(): Observable<{ userCount: number }> {
        return this.http.get<{ userCount: number }>(`${SERVER_API_URL}api/user/count-all`);
    }
    getUserCountByRole(role: string): Observable<{ role: string, userCount: number }> {
        return this.http.get<{ role: string, userCount: number }>(`${SERVER_API_URL}api/user/count-by-role?role=${role}`);
    }
    getUserByRole(role: string, page: number = 0, size: number = 20): Observable<HttpResponse<Page<User>>> {
        const params = new HttpParams()
            .set('role', role)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<Page<User>>(`${SERVER_API_URL}api/user/get-by-role-pageable`, { params, observe: 'response' }).pipe(
            catchError(e => this.handleError(e, 'Fetching users by role failed'))
        );
    }
    private handleError(error: any, message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
        });
        return throwError(error);
    }

}
