import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private cliente: Cliente;

  constructor( private http: HttpClient,
              private router: Router  ) { }

    //METODOS
    cargarClientesTodos(): Observable<object> {
      return this.http.get(`${environment.base_url}/clientes/sinlimite` , this.cabeceras);
    }

    cargarClientes( desde: number, textoBusqueda?: string ): Observable<object> {
      if (!desde) { desde = 0;}
      if (!textoBusqueda) {textoBusqueda = '';}
      return this.http.get(`${environment.base_url}/clientes/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    }

    cargarInformesConTexto( desde: number, textoBusqueda?: string ): Observable<object> { //informesFisio
      if (!desde) { desde = 0;}
      if (!textoBusqueda) {textoBusqueda = '';}
      return this.http.get(`${environment.base_url}/clientes/informesCliente/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    }

    cargarInformesConTextoYFisio(uidFisio:string, desde: number, textoBusqueda?: string ): Observable<object> {
      if (!desde) { desde = 0;}
      if (!textoBusqueda) {textoBusqueda = '';}
      return this.http.get(`${environment.base_url}/clientes/informesCliente/?uidFisio=${uidFisio}&?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    }

    cargarRutinasConTextoYFisio(uidFisio:string, desde: number, textoBusqueda?: string ): Observable<object> {
      if (!desde) { desde = 0;}
      if (!textoBusqueda) {textoBusqueda = '';}
      return this.http.get(`${environment.base_url}/clientes/rutinasClientePaginadas/?uidFisio=${uidFisio}&?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
    }

    //Service para cargar la lista de fisios de un cliente
    cargarListaFisios(){
      return this.http.get(`${environment.base_url}/clientes/listaFisios` , this.cabeceras);
    }

    borrarCliente( uid: string) {
      if (!uid || uid === null) {uid = 'a'; }
      return this.http.delete(`${environment.base_url}/clientes/${uid}` , this.cabeceras);
    }

    login( formData: loginForm) {
    return this.http.post(`${environment.base_url}/login`, formData)
            .pipe(
              tap( (res : any) => {
                localStorage.setItem('token', res['token']);
                const {uid} = res;
                this.cliente = new Cliente(uid);

              })
            );
   }

   logout(): void {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/landing');
    window.location.reload();
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usuario y en localstore
          const { uid, cliente, nombre_apellidos, email, rol, alta, activo, imagen, token} = res;
          localStorage.setItem('token', token);
          this.cliente = new Cliente(uid, rol, nombre_apellidos, email, alta, activo, imagen);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  cambiarActivoLista ( uid: string) {

    return this.http.put(`${environment.base_url}/clientes/ca/${uid}`, {variable:""},this.cabeceras);
  }

  cambiarActivoRutina ( uid: string, idRutina: string) {

    return this.http.put(`${environment.base_url}/clientes/carc/${uid}?idRutina=${idRutina}`, {variable:""},this.cabeceras);
  }

   cargarCliente( uid: string) {
    if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/clientes/${uid}` , this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/fotoperfil/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/fotoperfil/${uid}`, datos, this.cabeceras);
  }

  cargarRutinasCliente() {
    // if (!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/clientes/rutinasCliente/` , this.cabeceras);
  }

  nuevoCliente ( data: Cliente) {
    return this.http.post(`${environment.base_url}/clientes/`, data, this.cabeceras);
  }

  envioCorreoReestablecer ( data) { // para reestablecer contraseña
    return this.http.post(`${environment.base_url}/clientes/erp`, data, this.cabeceras);
  }

  actualizarCliente ( uid: string, data: Cliente) {
    return this.http.put(`${environment.base_url}/clientes/${uid}`, data, this.cabeceras);
  }

  cambiarPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/clientes/np/${uid}`, data, this.cabeceras);
  }

  establecerPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/clientes/cp/${uid}`, data, this.cabeceras);
  }

  reestablecerPassword( uid: string, data) {
    return this.http.put(`${environment.base_url}/clientes/rp/${uid}`, data, this.cabeceras);
  }

  establecerimagen(nueva: string): void {
    this.cliente.imagen = nueva;
  }

  establecerdatos(nombre_apellidos: string, email: string): void {
    this.cliente.nombre_apellidos = nombre_apellidos;
    this.cliente.email = email;
  }

  crearImagenUrl( imagen: string) {

    const token = localStorage.getItem('token') || '';
    if (!imagen) {
      return `${environment.base_url}/upload/fotoperfil/no-imagen.jpg?token=${token}`;
    }
    return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
  }

  crearImagenUrlBest( imagen: string) {

    const token = `${environment.tokenBest}`;
    if (!imagen) {
      return `${environment.base_url}/upload/fotoperfil/no-imagen.jpg?token=${token}`;
    }
    return `${environment.base_url}/upload/fotoperfil/${imagen}?token=${token}`;
  }


    //GETTERS
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
      return this.cliente.uid;
    }

    get nombre_apellidos(): string{

      return this.cliente.nombre_apellidos;
    }

    get email(): string{
      return this.cliente.email;
    }

    get imagen(): string{
      return this.cliente.imagen;
    }

    get imagenURL(): string{
      return this.cliente.imagenUrl;
    }

}
