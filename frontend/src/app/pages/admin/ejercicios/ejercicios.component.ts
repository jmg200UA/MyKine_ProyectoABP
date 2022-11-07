import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Ejercicio } from '../../../models/ejercicio.models';
import { EjercicioService } from '../../../services/ejercicio.service';
import Swal from 'sweetalert2';
import { ConstantPool } from '@angular/compiler';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css']
})
export class EjerciciosComponent implements OnInit {

  //ATRIBUTOS PUBLICOS
  public loading = true;

  public totalEjercicios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaEjercicios: Ejercicio[] = [];

  constructor( private EjercicioService: EjercicioService,
    private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarEjercicios(this.ultimaBusqueda);
  }

  cargarEjercicios( textoBuscar: string ){

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

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarEjercicios(this.ultimaBusqueda);
  }

  eliminarEjercicio( uid: string, nombre: string) {
    // Solo los admin pueden borrar ejercicios
    if (this.UsuarioService.rol !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar ejercicio',
      text: `Al eliminar el ejercicio '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.EjercicioService.borrarEjercicio(uid)
              .subscribe( resp => {
                this.cargarEjercicios(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
              })
          }
      });
  }

}


