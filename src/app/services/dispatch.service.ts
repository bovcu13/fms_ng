import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; //http協定
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment.development";

const BaseUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class DispatchService {

  constructor(private http: HttpClient) {
  }

  //--託運訂單------------------------------------------------------------------------------------------------

  getAllTransportOrder(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-orders?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneTransportOrder(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-orders/${id}`;
    return this.http.get<any>(url);
  }

  postTransportOrder(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-orders`;
    return this.http.post<any>(url, body);
  }

  patchTransportOrder(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-orders/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteTransportOrder(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-orders/${id}`;
    return this.http.delete<any>(url);
  }

  //--託運訂單詳細------------------------------------------------------------------------------------------------

  getAllTransportOrderDetail(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-order-details?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneTransportOrderDetail(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-order-details/${id}`;
    return this.http.get<any>(url);
  }

  postTransportOrderDetail(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-order-details`;
    return this.http.post<any>(url, body);
  }

  patchTransportOrderDetail(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-order-details/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteTransportOrderDetail(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-order-details/${id}`;
    return this.http.delete<any>(url);
  }

  //--派工任務------------------------------------------------------------------------------------------------

  getAllTransportTask(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-tasks?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneTransportTask(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-tasks/${id}`;
    return this.http.get<any>(url);
  }

  postTransportTask(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-tasks`;
    return this.http.post<any>(url, body);
  }

  patchTransportTask(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-tasks/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteTransportTask(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/transport-tasks/${id}`;
    return this.http.delete<any>(url);
  }

}
