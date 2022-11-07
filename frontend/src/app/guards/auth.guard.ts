import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarToken()
              .pipe(
                tap( resp => {
                  // Si devuelve falso, el token no es bueno, salimos a login
                  if (!resp) {
                    this.router.navigateByUrl('/landing');
                  } else {
                    // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
                    if ((next.data.rol !== '*') && (this.usuarioService.rol !== next.data.rol)) {
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
                   }
                  }
                })
              );
  }

}
