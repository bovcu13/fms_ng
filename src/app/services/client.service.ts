import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; //http協定
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment.development";

const BaseUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) {
  }

  //--客戶------------------------------------------------------------------------------------------------

  getAllClientRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/clients?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneClientRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/clients/${id}`;
    return this.http.get<any>(url);
  }

  postClientRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/clients`;
    return this.http.post<any>(url, body);
  }

  patchClientRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/clients/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteClientRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/clients/${id}`;
    return this.http.delete<any>(url);
  }

}
