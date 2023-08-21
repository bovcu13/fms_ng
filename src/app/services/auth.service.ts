import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users = [
    {company: 'A12345', account: 'admin', password: '12345', role: 'admin'},
    {company: 'B00001', account: 'user1', password: '12345', role: 'user'}
  ];

  constructor() {
  }

  login(company: string, account: string, password: string): boolean {
    const user = this.users.find(u => u.company === company && u.account === account && u.password === password);
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
