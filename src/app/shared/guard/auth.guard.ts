import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // 只有 role = admin 才可以進入 /role
      if (route.routeConfig?.path === 'role' && currentUser.role !== 'admin') {
        return this.router.createUrlTree(['/main']);
      }
      return true;
    }
    return this.router.createUrlTree(['/login']); // Redirect to login page if not logged in
  }
}
