import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; //http協定
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment.development";

const BaseUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient) {
  }

  //--權限------------------------------------------------------------------------------------------------

  getPoliciesRequest(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/policies`;
    return this.http.get<any>(url);
  }

  postPoliciesRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/policies`;
    return this.http.post<any>(url, body);
  }

  deletePoliciesRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/policies`;
    return this.http.delete<any>(body);
  }

  //--角色------------------------------------------------------------------------------------------------

  getAllRolesRequest(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/roles`;
    return this.http.get<any>(url);
  }

  postRolesRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/roles`;
    return this.http.post<any>(url, body);
  }

  getOneRoleRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/roles/${id}`;
    return this.http.get<any>(url);
  }

  deleteRoleRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/roles/${id}`;
    return this.http.delete<any>(url);
  }

  patchRoleRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/roles/${id}`;
    return this.http.patch<any>(url, body);
  }

  //--使用者------------------------------------------------------------------------------------------------

  getAllUsersRequest(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/users`;
    return this.http.get<any>(url);
  }

  postUserRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/users`;
    return this.http.post<any>(url, body);
  }

  getOneUserRequest(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/users/current-user`;
    return this.http.get<any>(url);
  }

  deleteUserRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/users/${id}`;
    return this.http.delete<any>(url);
  }

  patchUserRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/users/current-user`;
    return this.http.patch<any>(url, body);
  }

  //--車隊------------------------------------------------------------------------------------------------

  getAllFleetRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/fleets?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneFleetRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/fleets/${id}`;
    return this.http.get<any>(url);
  }

  postFleetRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/fleets`;
    return this.http.post<any>(url, body);
  }

  patchFleetRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/fleets/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteFleetRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/fleets/${id}`;
    return this.http.delete<any>(url);
  }

  //--車機------------------------------------------------------------------------------------------------

  getGpsDevicesRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps-devices?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getGpsDeviceRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps-devices/${id}`;
    return this.http.get<any>(url);
  }

  postGpsDeviceRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps-devices`;
    return this.http.post<any>(url, body);
  }

  patchGpsDeviceRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps-devices/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteGpsDeviceRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps-devices/${id}`;
    return this.http.delete<any>(url);
  }

  //--司機---------------------------------------------------------------------------------------------------
  getAllDriversRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/drivers?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  getOneDriverRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/drivers/${id}`;
    return this.http.get<any>(url);
  }

  postDriverRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/drivers`;
    return this.http.post<any>(url, body);
  }

  patchDriverRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/drivers/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteDriverRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/drivers/${id}`;
    return this.http.delete<any>(url);
  }

  //--車輛狀態------------------------------------------------------------------------------------------------

  getAllGpsRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps/list/${id}`;
    return this.http.post<any>(url, body);
  }

  getAllNewGpsRequest(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps/list`;
    return this.http.get<any>(url);
  }

  getOneGpsRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/gps/${id}`;
    return this.http.get<any>(url);
  }

  //--登入------------------------------------------------------------------------------------------------

  postLoginRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/login`;
    return this.http.post<any>(url, body);
  }

  postRefreshRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/refresh`;
    return this.http.post<any>(url, body);
  }

  //--車輛------------------------------------------------------------------------------------------------

  getAllVehiclesRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/vehicles?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  postVehicleRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/vehicles`;
    return this.http.post<any>(url, body);
  }

  getOneVehicleRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/vehicles/${id}`;
    return this.http.get<any>(url);
  }

  deleteVehicleRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/vehicles/${id}`;
    return this.http.delete<any>(url);
  }

  patchVehicleRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/vehicles/${id}`;
    return this.http.patch<any>(url, body);
  }

  //--板車------------------------------------------------------------------------------------------------

  getAllTrailersRequest(page: number = 1, limit: number = 20): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/trailers?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  postTrailersRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/trailers`;
    return this.http.post<any>(url, body);
  }

  getOneTrailersRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/trailers/${id}`;
    return this.http.get<any>(url);
  }

  deleteTrailersRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/trailers/${id}`;
    return this.http.delete<any>(url);
  }

  patchTrailersRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/trailers/${id}`;
    return this.http.patch<any>(url, body);
  }
}
