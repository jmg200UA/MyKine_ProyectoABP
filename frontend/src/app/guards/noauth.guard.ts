import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
                private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarNoToken()
              .pipe(
                tap( resp => {
                  if (!resp) {
                    switch (this.usuarioService.rol) {
                      case 'ROL_ADMIN':
                        this.router.navigateByUrl('/admin/dashboard');
                        break;
                      case 'ROL_CLIENTE':
                        this.router.navigateByUrl('/cliente/dashboard');
                        break;
                      case 'ROL_FISIO':
                        this.router.navigateByUrl('/fisio/dashboard');
                        break;
                    }
                    //this.router.navigateByUrl('/dashboard');
                  }
                })
              );
  }
}
