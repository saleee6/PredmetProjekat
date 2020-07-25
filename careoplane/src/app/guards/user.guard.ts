import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivateChild {
  constructor(
    private router: Router
  ) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    if(localStorage.getItem('token') == null){
      if(next.routeConfig.path.includes('reserv')){
        return this.router.parseUrl('/notauthorized');
      }
      else{
        return true;
      }
    }
    else{
      if(localStorage.getItem('role').includes('Admin')){
        return this.router.parseUrl('/notauthorized');
      }
      return true;
    }
  }
}
