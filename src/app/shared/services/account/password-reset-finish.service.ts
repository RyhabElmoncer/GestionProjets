import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SERVER_API_URL} from "../../../../app.constants";


@Injectable({ providedIn: 'root' })
export class PasswordResetFinishService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param key
   * @param newPassword
   */
  save(key: string, newPassword: string): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'api/account/reset-password/finish', { key, newPassword });
  }
}
