import { Component, OnInit } from '@angular/core';
import { Rutina } from '../../../models/rutina.models';
import { Usuario } from '../../../models/usuario.model';
import { RutinaService } from '../../../services/rutinas.service';
import { UsuarioService } from '../../../services/usuario.service';
import { environment } from '../../../../environments/environment.prod';
import { Ejercicio } from 'src/app/models/ejercicio.models';
import { EjercicioService } from '../../../services/ejercicio.service';
import Swal from 'sweetalert2';
import 'animate.css';
import { forEach } from 'gl-matrix-ts/dist/vec3';
import { Cliente } from 'src/app/models/cliente.model';


@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.component.html',
  styleUrls: ['./rutinas.component.css']
})
export class RutinasComponent implements OnInit {

  public loading = true;
  public categoria ='Cabeza';
  public ejer ='';

  public totalRutinas = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaRutinas: Rutina[] = [];
  public listaUsuarios: Cliente[] = [];
  public listaEjercicios: Ejercicio[] = [];
  public totalEjercicios: number;
  public listaEjerciciosRutina: string[]=[];

  constructor(private RutinaService: RutinaService,
    private UsuarioService: UsuarioService,
    private EjercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.cargarListaClientes();
    this.cargarRutinas(this.ultimaBusqueda);
    this.cargarEjercicios(this.ultimaBusqueda);
  }

  cargarRutinas(textoBuscar: string ){
    this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.RutinaService.cargarRutinas( this.posicionactual, textoBuscar )
        .subscribe( res => {
          if (res['rutinas'].length === 0) {

            if (this.posicionactual > 0) {
              this.posicionactual = this.posicionactual - this.registrosporpagina;
              if (this.posicionactual < 0) { this.posicionactual = 0};
              this.cargarRutinas(this.ultimaBusqueda);
            } else {
              this.listaRutinas = [];
              this.totalRutinas = 0;
            }
          } else {
            this.listaRutinas = res['rutinas'];
            this.totalRutinas = res['page'].total;
            for(var i=0; i<this.listaRutinas.length;i++){
              this.cargarEjerciciosRutina(this.listaRutinas[i].uid);
            }

          }
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });
  }

  cargarEjercicios(textoBuscar: string ){
    this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.EjercicioService.cargarEjercicios( this.posicionactual, textoBuscar )
        .subscribe( res => {
          if (res['ejercicios'].length === 0) {

            if (this.posicionactual > 0) {
              this.posicionactual = this.posicionactual - this.registrosporpagina;
              if (this.posicionactual < 0) { this.posicionactual = 0};
              this.cargarEjercicios(this.ultimaBusqueda);
            } else {
              this.listaEjercicios = [];
              this.totalEjercicios = 0;
            }
          } else {
            this.listaEjercicios = res['ejercicios'];
            this.totalEjercicios = res['page'].total;
          }
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });


  }

  cargarEjerciciosRutina(uid:string){
      this.RutinaService.obtenerEjerciciosRutina( uid )
        .subscribe( res => {

          this.listaEjerciciosRutina.push(res['ejerciciosRutina']);
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });



  }



  eliminarRutina( uid: string, titulo: string ) {

    Swal.fire({
      title: 'Eliminar rutina',
      text: `Al eliminar la rutina '${titulo}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.RutinaService.borrarRutina(uid)
              .subscribe( resp => {
                this.cargarRutinas(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }

  cargarListaClientes(){
    this.UsuarioService.cargarListaClientes()
      .subscribe( res => {
        this.listaUsuarios = res['clientes'];
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
  }

  enviaracliente(rutid: string,rutnom: string){

    const items = [];
    var usu =this.listaUsuarios;
    var sal=0;

    for(var i=0;i<usu.length;i++){
      if(usu[i].cliente.rutinas.length==0){
        items[i] = { id: usu[i].cliente.uid, name: usu[i].cliente.nombre_apellidos}
      }
      else{
        for(var j=0;j<usu[i].cliente.rutinas.length;j++){
          if(usu[i].cliente.rutinas[j].rutina==rutid){
            sal=1;
          }
        }
        if(sal==0){
          items[i] = { id: usu[i].cliente.uid, name: usu[i].cliente.nombre_apellidos}
        }
      }
      sal=0;
    }

    const inputOptions = new Map;
    items.forEach(item => inputOptions.set(item.id,item.name));

    let ru= this;

    if(items.length>0){
      Swal.fire({
        title: 'Enviar rutina a cliente',
        text: `¿A que cliente quieres enviar la rutina: '${rutnom}' ?`,
        input: 'select',
        inputOptions,
        showCancelButton: true
      }).then(function (result) {
        if (result.value) {
          let rutina= rutid;
          let cliente= result.value.toString();

          ru.RutinaService.enviarRutina(rutina,cliente)
            .subscribe( resp => {
              Swal.fire({icon: 'success', title: 'La rutina se ha enviado correctamente'});
              ru.cargarRutinas(ru.ultimaBusqueda);
              ru.cargarEjercicios(ru.ultimaBusqueda);
              ru.cargarListaClientes();
            }
            ,(err) =>{
              Swal.fire({icon: 'error', title: 'Error enviando la rutina', text: 'El cliente ya tiene esa rutina'});
            })
        }
      });
    }
    else{
      Swal.fire({
        title: 'Añadir rutina al cliente',
        text: `Todos tus clientes tienen la rutina: '${rutnom}' ?`,
        showCancelButton: false
      });
    }
  }

  quitaracliente(rutid: string,rutnom: string){

    const items = [];
    var entra = 0;
    var usu =this.listaUsuarios;

    for(var i=0;i<usu.length;i++){
      for(var j=0;j<usu[i].cliente.rutinas.length;j++){
        if(usu[i].cliente.rutinas[j].rutina == rutid){
          items[i] = { id: usu[i].cliente.uid, name: usu[i].cliente.nombre_apellidos}
          entra=1;
        }
      }
    }
    const inputOptions = new Map;
    items.forEach(item => inputOptions.set(item.id,item.name));

    let tu= this;

    if(entra==1){

      Swal.fire({
        title: 'Quitar rutina al cliente',
        text: `¿A que cliente quieres quitarle la rutina: '${rutnom}' ?`,
        input: 'select',
        inputOptions,
        showCancelButton: true
      }).then(function (result) {
        if (result.value) {
          let rutina= rutid;
          let cliente= result.value.toString();

          tu.RutinaService.quitarRutina(rutina,cliente)
            .subscribe( resp => {
              Swal.fire({icon: 'success', title: 'La rutina se ha quitado correctamente'});
              tu.cargarRutinas(tu.ultimaBusqueda);
              tu.cargarEjercicios(tu.ultimaBusqueda);
              tu.cargarListaClientes();
            }
            ,(err) =>{
              Swal.fire({icon: 'error', title: 'Error quitando la rutina'});
            })
        }
      });

    }
    else{
      Swal.fire({
        title: 'Quitar rutina al cliente',
        text: `Ningun cliente tiene la rutina: '${rutnom}' ?`,
        showCancelButton: false
      });
    }
  }




  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarRutinas(this.ultimaBusqueda);
  }
}
