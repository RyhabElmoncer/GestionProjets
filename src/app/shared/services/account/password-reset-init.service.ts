import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../../../core/user/user.types";
import {SERVER_API_URL} from "../../../../app.constants";

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param account
   */
  save(account: any): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'api/register', account);
  }

    checkEmailExists(email: string) {
        return this.http.get(`${SERVER_API_URL}api/users/checkEmail?email=${email}`);
    }

    /**
     *
     * @param account
     */
    create(account: any): Observable<{}> {
        return this.http.post(SERVER_API_URL + 'api/users/register-user', account);
    }
}

