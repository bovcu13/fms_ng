import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users = [
    {fleet_code: 'A12345', user_name: 'admin', password: '12345', role: 'admin'},
    {fleet_code: 'B00001', user_name: 'user1', password: '12345', role: 'user'}
  ];

  constructor() {
  }

  login(fleet_code: string, user_name: string, password: string): boolean {
    const user = this.users.find(u => u.fleet_code === fleet_code && u.user_name === user_name && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }
}
