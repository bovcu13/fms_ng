import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TokenStorageService} from "../../services/token-storage.service";

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {

  constructor(
    private token: TokenStorageService,
    private authServ: AuthService,
    private router: Router
  ) {
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
  //   const currentUser = this.authServ.getCurrentUser();
  //   if (currentUser) {
  //     // 只有 role = admin 才可以進入 /role
  //     if (route.routeConfig?.path === 'role' && currentUser.role !== 'admin') {
  //       return this.router.createUrlTree(['/main']);
  //     }
  //     return true;
  //   }
  //   return this.router.createUrlTree(['/login']); // Redirect to login page if not logged in
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // access token 是否有值
    if (this.token.getToken()) {
      return true; // 允許訪問受保護的路由
    } else {
      return this.router.createUrlTree(['/login']); // 返回UrlTree以重定向到登錄頁面
    }
  }
}
