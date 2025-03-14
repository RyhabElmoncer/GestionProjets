import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SERVER_API_URL} from "../../../../app.constants";


@Injectable({ providedIn: 'root' })
export class ActivateService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param key
   */
  get(key: string): Observable<{}> {
    return this.http.get(SERVER_API_URL + 'api/activate', {
      params: new HttpParams().set('key', key),
    });
  }
}
