import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'https://fmp.t.api.jinher-net.com/fms';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users = [
    {fleet_code: 'A12345', user_name: 'admin', password: '12345', role: 'admin'},
    {fleet_code: 'B00001', user_name: 'user1', password: '12345', role: 'user'}
  ];

  constructor(private http: HttpClient) {
  }

  // 登入
  login(body: any): Observable<any> {
    const url = `${AUTH_API}/web/v1.0/login`;
    return this.http.post(url, body, httpOptions);
  }

  // 登出
  signOut(): void {
    window.sessionStorage.clear();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  register(body: any): Observable<any> {
    const url = `${AUTH_API}/web/v1.0/users`;
    return this.http.post(url, body, httpOptions);
  }

  refreshToken(token: string) {
    const url = `${AUTH_API}/web/v1.0/refresh`;
    return this.http.post(url, {refresh_token: token}, httpOptions);
  }

  getCurrentUser(): any {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }
}
