import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AeroAdminGuard implements CanActivateChild {
  constructor(
    private router: Router
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    if(next.routeConfig.path === 'new'){
      if (localStorage.getItem('role') === 'aeroAdminNew') {
        return true;
      } else {
        return this.router.parseUrl('/notauthorized');
      }
    }
    else{
      if (localStorage.getItem('role') === 'aeroAdmin') {
        return true;
      } else {
        return this.router.parseUrl('/notauthorized');
      }
    }
  }
}
