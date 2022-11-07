import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Ejercicio } from '../models/ejercicio.models';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {

  private ejercicio: Ejercicio;

  constructor(private http: HttpClient,
               private router: Router) { }


  nuevoEjercicio ( data: Ejercicio) {
    return this.http.post(`${environment.base_url}/ejercicios/`, data, this.cabeceras);
  }

  obtenerEjercicio (uid: string){
    return this.http.get(`${environment.base_url}/ejercicios/?id=${uid}`, this.cabeceras);
  }

  cargarEjercicios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/ejercicios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  actualizarEjercicio ( uid: string, data: Ejercicio) {
    return this.http.put(`${environment.base_url}/ejercicios/${uid}`, data, this.cabeceras);
  }

  cargarEjerciciosNoPag() {
    return this.http.get(`${environment.base_url}/ejercicios/np` , this.cabeceras);
  }

  borrarEjercicio(uid: string){
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/ejercicios/${uid}` , this.cabeceras);
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

  get uid(): string {
    return this.ejercicio.uid;
  }

}
