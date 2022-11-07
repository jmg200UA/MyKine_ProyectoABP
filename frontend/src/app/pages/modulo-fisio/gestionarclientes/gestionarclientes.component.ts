import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';
import { Usuario } from '../../../models/usuario.model';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionarclientes',
  templateUrl: './gestionarclientes.component.html',
  styleUrls: ['./gestionarclientes.component.css']
})
export class GestionarclientesComponent implements OnInit {

  //ATRIBUTOS PUBLICOS
  public loading = true;

  public totalClientes = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaClientes: Cliente[] = [];
  public listaUsuarios: Usuario[] = [];

  public plan ='';

  public listaClientesActivos: Cliente[] = [];
  public listaClientesNoActivos: Cliente[] = [];
  public clientes = 0;

  public listaClientesId: {_id:any}[]= [];
  public listaClientesIdActivos: {_id:any}[]= [];
  public listaClientesIdNoActivos: {_id:any}[]= [];

  constructor( private usuarioService: UsuarioService,
               private router: Router,
               private route: ActivatedRoute,
               private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.cargarListaClientesConTexto(this.ultimaBusqueda);
    this.cargarClientes();
  }

  cargarUsuario(){
    this.usuarioService.cargarUsuario(this.usuarioService.uid)
    .subscribe( res => {
    this.plan = res['usuarios'].planMensual;

    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  cargarClientes(){

    //this.loading = true;

      this.usuarioService.cargarListaClientes()
          .subscribe( res => {

            this.cargarUsuario();


          this.listaClientes = res['clientes'];


          for(let i=0; i<this.listaClientes.length; i++){
            this.listaClientesId.push({_id:res['clientes'][i]._id});

          }




          for(var i=0;i<this.listaClientes.length;i++){
            if(this.listaClientes[i].activo){
              this.listaClientesActivos.push(this.listaClientes[i]);
            }
          }



          for(let i=0; i<this.listaClientes.length; i++){
            if(res['clientes'][i].activo){
              this.listaClientesIdActivos.push({_id:res['clientes'][i]._id});
            }
          }



          for(var i=0;i<this.listaClientes.length;i++){
            if(!(this.listaClientes[i].activo)){
              this.listaClientesNoActivos.push(this.listaClientes[i]);
            }
          }


          for(let i=0; i<this.listaClientes.length; i++){
            if(!(res['clientes'][i].activo)){
              this.listaClientesIdNoActivos.push({_id:res['clientes'][i]._id});
            }
          }

            }, (err) => {
            Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          });
}


  cargarListaClientesConTexto( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarListaClientesConTexto( this.posicionactual, textoBuscar )
      .subscribe( res => {
        if (res['clientes'].length === 0) {

          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarListaClientesConTexto(this.ultimaBusqueda);
          } else {
            this.listaClientes = [];
            this.totalClientes = 0;
          }
        } else {
          this.listaClientes = res['clientes'];
           this.totalClientes = res['page'].total;
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
    this.cargarListaClientesConTexto(this.ultimaBusqueda);
  }

  crearImagenUrl(imagen: string) {
    return this.clienteService.crearImagenUrl(imagen);
  }

  aceptarver(uid){
    var ret=1;

    for(var i=0;i<this.listaClientesIdActivos.length;i++){
      if(this.listaClientesIdActivos[i]._id==uid){
        ret= 0;
      }
    }

    return ret;
  }

  cambiarActivo(uid: string){

    if(this.listaClientesIdActivos.length==0){
      this.clienteService.cambiarActivoLista(uid).subscribe( res => {

        Swal.fire({
          icon: 'success',
          title: 'Campo activo cliente modificado',
          showConfirmButton: false,
          timer: 2000
        })
        window.location.reload();

      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
    }

    else if(this.plan=="Gratis" && this.listaClientesIdActivos.length==1 && this.listaClientesIdActivos[0]._id==uid){


      this.clienteService.cambiarActivoLista(uid).subscribe( res => {

        Swal.fire({
          icon: 'success',
          title: 'Campo activo cliente modificado',
          showConfirmButton: false,
          timer: 2000
        })
        window.location.reload();

      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
    }
    else if(this.plan!="Gratis"){
      this.clienteService.cambiarActivoLista(uid).subscribe( res => {

      Swal.fire({
        icon: 'success',
        title: 'Campo activo cliente modificado',
        showConfirmButton: false,
        timer: 2000
      })
      window.location.reload();

    }, (err) => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
      return;
    });
  }

  }

  eliminarCliente( uid: string, nombre: string ) {
    Swal.fire({
      title: 'Eliminar cliente',
      text: `Al eliminar el cliente con nombre '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.clienteService.borrarCliente(uid)
              .subscribe( resp => {
                this.cargarListaClientesConTexto(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              })
          }
      });
  }

}
