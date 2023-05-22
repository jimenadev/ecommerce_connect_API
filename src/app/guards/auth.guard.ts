import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService:TokenService,
    private router: Router,
    private authService:AuthService
  ){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   /* const token = this.tokenService.getToken()
    if(!token){
      this.router.navigate(['/home'])
      return false
    }*/
    return this.authService.user$
              .pipe(
                map(user => {
                    if(!user){
                      this.router.navigate(['/home'])
                      return false
                    }
                    return true
                })
              )
  }

}
