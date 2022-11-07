import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Rutina } from '../models/rutina.models'

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  cargarEjercicios: any;

  constructor(private http: HttpClient,
               private router: Router) { }

  nuevaRutina ( data: Rutina) {
    return this.http.post(`${environment.base_url}/rutinas/`, data, this.cabeceras);
  }

  actualizarRutina ( uid: string, data: Rutina) {

    return this.http.put(`${environment.base_url}/rutinas/${uid}`, data, this.cabeceras);
  }

  obtenerRutina (uid: string){
    return this.http.get(`${environment.base_url}/rutinas/?id=${uid}`, this.cabeceras);
  }

  obtenerEjerciciosRutina (uid: string){
    return this.http.get(`${environment.base_url}/rutinas/ejr/${uid}`, this.cabeceras);
  }

  obtenerFisioRutina (uid: string){
    return this.http.get(`${environment.base_url}/rutinas/fr/${uid}`, this.cabeceras);
  }

  cargarRutinas( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/rutinas/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  enviarRutina( rut: string, cliente: string){
    return this.http.put(`${environment.base_url}/rutinas/ar/${rut}?idcliente=${cliente}`,'', this.cabeceras);
  }

  finRutina( rut: string, data){ // llamada para actualizar veces y tiempo rutina
    return this.http.put(`${environment.base_url}/rutinas/vt/${rut}`,data, this.cabeceras);
  }

  quitarRutina( rut: string, cliente: string){
    return this.http.put(`${environment.base_url}/rutinas/qr/${rut}?idcliente=${cliente}`,'', this.cabeceras);
  }

  borrarRutina( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/rutinas/${uid}` , this.cabeceras);
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
