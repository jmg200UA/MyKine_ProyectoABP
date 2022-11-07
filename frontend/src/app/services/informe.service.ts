import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Informe } from '../models/informe.model';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor(private http: HttpClient,
               private router: Router) { }

  nuevoInforme ( data: Informe) {
    return this.http.post(`${environment.base_url}/informes/`, data, this.cabeceras);
  }

  obtenerInforme (uid: string){
    return this.http.get(`${environment.base_url}/informes/?id=${uid}`, this.cabeceras);
  }

  actualizarInforme ( uid: string, data: Informe) {
    return this.http.put(`${environment.base_url}/informes/${uid}`, data, this.cabeceras);
  }

  cargarInformesConTexto( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/informes/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  borrarInforme( uid: string) {
    return this.http.delete(`${environment.base_url}/informes/${uid}` , this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


}
