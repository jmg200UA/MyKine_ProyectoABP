import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';
import { InformeService } from '../../../services/informe.service';
import { PdfMakeWrapper, Txt, TextReference } from 'pdfmake-wrapper';
import { Informe } from '../../../models/informe.model';
import { environment } from '../../../../environments/environment';
import { Rutina } from '../../../models/rutina.models';
import { Usuario } from '../../../models/usuario.model';
import { RutinaService } from '../../../services/rutinas.service';
import { Cliente } from 'src/app/models/cliente.model';
import { Ejercicio } from 'src/app/models/ejercicio.models';
import { EjercicioService } from '../../../services/ejercicio.service';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  //ATRIBUTOS GENERALES
  private uid: string = '';
  private fisio: Usuario;
  public cliente:Cliente;
  public clienterut:Cliente;
  private rutinaActiva: Boolean[]=[];
  public fotocliente:any;

  //ATRIBUTOS PUBLICOS PARA INFORMES
  public loading = true;

  public totalInformes = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaInformes: {cliente_asociado:Cliente, contenido:string, fecha:Date, fisio_asociado:string, titulo:string, uid:string}[] = [];
  public listaInformesFiltrado: {cliente_asociado:Cliente, contenido:string, fecha:Date, fisio_asociado:string, titulo:string, uid:string}[] = [];

  // ATRIBUTOS PUBLICOS PARA RUTINAS
  public categoria ='Cabeza';
  public ejer ='';

  public totalRutinas = 0;
  public posicionactual2 = 0;
  public registrosporpagina2 = environment.registros_por_pagina;

  private ultimaBusqueda2 = '';
  public listaRutinas: Rutina[] = [];
  public listaRutinasFiltradas: Rutina[] = [];
  public listaRutinasCliente: Rutina[] = [];
  public listaUsuarios: Cliente[] = [];


  constructor( private fb: FormBuilder,
               private clienteService: ClienteService,
               private usuarioService: UsuarioService,
               private route: ActivatedRoute,
               private router: Router,
               private informeService: InformeService,
               private RutinaService: RutinaService,
              private EjercicioService: EjercicioService) { }

  ngOnInit(): void {
  // recogemos el parametro
    this.uid = this.route.snapshot.params['uid'];
    this.obtenerFisioCliente();

    let titulo = document.getElementsByClassName("page-title");

  }

  crearImagenUrl(imagen: string) {
    return this.usuarioService.crearImagenUrl(imagen);
  }

  //FUNCION PARA OBTENER EL FISIO Y EL CLIENTE ESPECIFICO
  obtenerFisioCliente(){
    //cargar cliente
    this.usuarioService.cargarCliente(this.uid)
    .subscribe( res => {
      this.cliente = res['clientes'];
      this.clienterut= res['clientes'].cliente;
      this.listaRutinasCliente=res['clientes'].cliente.rutinas;
      this.fotocliente=res['clientes'].cliente.imagen;
      this.cargarInformesConTexto('');
    this.cargarListaClientes();
    this.cargarRutinas('');
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });

    //cargar fisio
    this.usuarioService.cargarUsuarioToken()
    .subscribe( res => {
      this.fisio = res['usuario'];
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });


  }


  // FUNCIONES PARA LOS INFORMES

  cargarInformesConTexto( textoBuscar: string ){
    if(!textoBuscar) textoBuscar="";
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarInformesConTexto( this.posicionactual, textoBuscar )
      .subscribe( res => {
        if (res['informesFisio'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarInformesConTexto(this.ultimaBusqueda);
          } else {
            this.listaInformes = [];
            // this.listaInformesFiltrado=[];
            this.totalInformes = 0;
          }
        } else {
          this.listaInformes = res['informesFisio'];

          //Filtramos por el cliente
          this.listaInformesFiltrado=[];
          for(var i=0; i<this.listaInformes.length;i++){
            for(var j=0;j<this.clienterut.informes.length;j++){
              if(this.listaInformes[i].uid==this.clienterut.informes[j]){
                this.listaInformesFiltrado.push(this.listaInformes[i]);
              }
            }
          }

           this.totalInformes = this.listaInformesFiltrado.length;

        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
}

eliminarInforme( uid: string, titulo: string ) {
  Swal.fire({
    title: 'Eliminar informe',
    text: `Al eliminar el informe con nombre '${titulo}' se perderán todos los datos asociados. ¿Desea continuar?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar'
  }).then((result) => {
        if (result.value) {
          this.informeService.borrarInforme(uid)
            .subscribe( resp => {
              window.location.reload();
            }
            ,(err) =>{
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            })
        }
    });
}

cambiarPagina( pagina: number ){
  pagina = (pagina < 0 ? 0 : pagina);
  this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  this.cargarInformesConTexto(this.ultimaBusqueda);
}

generarPDF(informe: Informe, bol: boolean){
  const pdf = new PdfMakeWrapper();
  var fecha = informe.fecha.toString();
  var fechaseparada = [];
  fechaseparada = fecha.split("T");
  fecha = fechaseparada[0];
  let tituloinf: string = "Informe de fecha " + fecha;
  let saltolinea: string = '\n';

  pdf.info({
    title: 'Informe - '+tituloinf,
    author: informe.fisio_asociado,
    subject: informe.cliente_asociado,
});

  pdf.defaultStyle({
    fontSize: 15
});

  pdf.add(
    new Txt(informe.titulo).alignment('center').italics().fontSize(40).bold().end
  );
  pdf.add(saltolinea);
  //pdf.watermark("Webdulaners");
  pdf.add(saltolinea);
  pdf.add(saltolinea);
  pdf.add(saltolinea);
  pdf.add(
    new Txt(informe.contenido).alignment('center').italics().end
  );

  if(bol){
    pdf.create().open(); // para simplemente abrir
  }
  else pdf.create().download(); // para descargar
}

//FUNCIONES PARA RUTINAS

cargarRutinas(textoBuscar: string ){
  if(!textoBuscar) textoBuscar="";
  this.ultimaBusqueda2 = textoBuscar;
    this.loading = true;
    this.RutinaService.cargarRutinas( this.posicionactual2, textoBuscar )
      .subscribe( res => {
        if (res['rutinas'].length === 0) {

          if (this.posicionactual2 > 0) {
            this.posicionactual2 = this.posicionactual2 - this.registrosporpagina2;
            if (this.posicionactual2 < 0) { this.posicionactual2 = 0};
            this.cargarRutinas(this.ultimaBusqueda2);
          } else {
            this.listaRutinas = [];
            this.totalRutinas = 0;
          }
        } else {
          this.listaRutinas = res['rutinas'];
          this.listaRutinasFiltradas=[];
          this.rutinaActiva=[];

          for(var i=0; i<this.listaRutinas.length;i++){
            for(var j=0; j<this.listaRutinasCliente.length;j++){
              if(this.listaRutinas[i].uid==this.clienterut.rutinas[j].rutina){
                this.listaRutinas[i].activa=this.clienterut.rutinas[j].activo;
                this.listaRutinasFiltradas.push(this.listaRutinas[i]);
                //this.rutinaActiva.push(this.clienterut.rutinas[j].activo);
              }
            }
          }
          this.totalRutinas = this.listaRutinasFiltradas.length;

        }
        this.loading = false;
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
              window.location.reload();
            }
            ,(err) =>{
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
            })
        }
    });
}

cargarListaClientes(){
  this.usuarioService.cargarListaClientes()
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
  var sal=1;

  for(var i=0;i<usu.length;i++){
    items[i] = { id: usu[i].cliente.uid, name: usu[i].cliente.nombre_apellidos}
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
            window.location.reload();
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


  let tu= this;


    Swal.fire({
      title: 'Quitar rutina al cliente',
      text: `¿Deseas quitarle al cliente: '${tu.clienterut.nombre_apellidos}'la rutina '${rutnom}' ?`,
      showCancelButton: true
    }).then(function (result) {
      if (result.value) {
        let rutina= rutid;
        tu.RutinaService.quitarRutina(rutina,tu.uid)
          .subscribe( resp => {
            Swal.fire({icon: 'success', title: 'La rutina se ha quitado correctamente'});
            window.location.reload();
          }
          ,(err) =>{
            Swal.fire({icon: 'error', title: 'Error quitando la rutina'});
          })
      }
    });
}


//CAMBIAR ACTIVO RUTINA CLIENTE
   cambiarActivoRutina(idRutina:string){
     this.clienteService.cambiarActivoRutina(this.uid,idRutina).subscribe( res => {

       Swal.fire({
         icon: 'success',
         title: 'Campo activo rutina modificado',
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



cambiarPagina2( pagina: number ){
  pagina = (pagina < 0 ? 0 : pagina);
  this.posicionactual2 = ((pagina - 1) * this.registrosporpagina2 >=0 ? (pagina - 1) * this.registrosporpagina2 : 0);
  this.cargarRutinas(this.ultimaBusqueda2);
}

}
