import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PremiumsService {

  //Atributos
  public listaPremiums: Usuario[] = [];
  public splitted;
  public total;
  public show=true;
  public loading = true;
  public posicionactual = 0;
  public registrosporpagina = 10;
  private ultimaBusqueda = '';

  constructor( private ususuarioService: UsuarioService ) { }


  cargarUsuariosPremiumPaginados(textoBuscar: string, _orden?:string){
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.ususuarioService.cargarUsuariosPremiumPaginados(this.posicionactual, textoBuscar, _orden)
    .subscribe (res => {
      if (res['usuarios'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarUsuariosPremiumPaginados(this.ultimaBusqueda);
        } else {
          this.listaPremiums = [];
          this.total = 0;
        }
      } else {
        this.listaPremiums = res['usuarios'];
        this.total = res['page'].total;
      }
      this.loading = false;

    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      //console.warn('error:', err);
      this.loading = false;
    });

  }
}
