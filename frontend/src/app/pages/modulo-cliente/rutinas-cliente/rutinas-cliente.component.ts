import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { Ejercicio } from 'src/app/models/ejercicio.models';
import { Rutina } from 'src/app/models/rutina.models';
import { ClienteService } from '../../../services/cliente.service';
import { RutinaService } from '../../../services/rutinas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-rutinas-cliente',
  templateUrl: './rutinas-cliente.component.html',
  styleUrls: ['./rutinas-cliente.component.css']
})
export class RutinasClienteComponent implements OnInit {

  //Nombre fisio pasado por componente
  @Input() fisioAhora: '';

  //Uid fisio pasado por componente
  @Input() fisioUid: '';


  constructor( private clienteService: ClienteService,private rutinaService: RutinaService, private router: Router, private fb: FormBuilder, private datePipe: DatePipe) { }

  public datosForm = this.fb.group({ // para obtener el numero del filtro a aplicar
    selectfiltro: [''],
    fecha1: [''],
    fecha2: ['']
  });

   //ATRIBUTOS
   public loading = true;

   public totalRutinas = 0;
   public posicionactual = 0;
   public registrosporpagina = environment.registros_por_pagina;
   public listaRutinas: Rutina[] = [];

   private ultimaBusqueda = '';

  public ejercicios: Ejercicio[]=[];

  public rutinas;

  public rutinasFiltradas: Rutina[]=[];

  //public RutinaDefinitivaEntera: {activa:boolean, nombre:string, descripcion:string, ejercicios:Ejercicio[], fecha:Date, fisio_asignado:String, uid:string }[]= [];

  //los dos arrays buenos
  //public RutinaDefinitiva: {activa:boolean, nombre:string, uid:string}[]= [];
  public RutinaReal: Rutina[]=[]; // datos completos de las rutinas totales
  public RutinaAux: {activo:any, duracion:any, veces_realizada:any}[]= []; // parar guardar los datos las rutinas buenas del cliente
  public RutinaActiva: Rutina[]=[]; // datos completos de las rutinas activas
  public RutinaAuxActiva: {activo:any, duracion:any, veces_realizada:any}[]= []; // parar guardar los datos las rutinas buenas del cliente solo activas

  //arrays generales para mostrar los datos
  public RutinaMostrar: Rutina[]=[];
  public RutinaAuxMostrar: {activo:any, duracion:any, veces_realizada:any}[]= [];
  public numfiltro=1; //variable para saber el filtro

  ngOnInit(): void {
    // document.getElementById("chatbot").hidden = false;
    //inicializamos los arrays a vacío para cuando se haga la recarga a otro fisio
    //todos los datos del cliente en recargar
    this.rutinasFiltradas= [];
    this.RutinaReal= [];
    this.RutinaAux= [];
    this.RutinaActiva= [];
    this.RutinaAuxActiva= [];
    this.cargarEsteCliente(this.ultimaBusqueda);
  }

  cambiarFiltro(num){ // num solo se le pasará y con valor 4 cuando sea el filtro de las fechas
    var filtro=this.datosForm.get('selectfiltro').value;
    if(num==4){ // para ordenar por fechas
      var f1=this.datosForm.get('fecha1').value;
      var f2=this.datosForm.get('fecha2').value;
      var fecha1=new Date(f1);
      var fecha2=new Date(f2);
      if(!f1 || !f2){ // si lo comprobamos con los dates da invalid
        // notificacion de que debe introducir las dos fechas
        Swal.fire({icon: 'error', title: 'Error introduciendo fechas', text: 'Debes introducir las dos fechas para filtrar'});
      }
      let auxfechas = this.RutinaMostrar;
      let auxfechascliente = this.RutinaAuxMostrar;
      let faux;
      this.RutinaMostrar= [];
      this.RutinaAuxMostrar = [];

      for(let i=0; i<auxfechas.length;i++){
        faux= new Date(auxfechas[i].fecha);
        if(fecha1<=faux && fecha2>=faux){
          this.RutinaMostrar.push(auxfechas[i]);
          this.RutinaAuxMostrar.push(auxfechascliente[i]);
        }
      }

    }
    else if(filtro){
      this.numfiltro=filtro;
      if(filtro==0){ // para mostrar solo rutinas activas
        this.RutinaMostrar=this.RutinaActiva;
        this.RutinaAuxMostrar=this.RutinaAuxActiva;
      }
      else if(filtro==1){ // para mostrar todas las rutinas
        this.RutinaMostrar=this.RutinaReal;
        this.RutinaAuxMostrar=this.RutinaAux;
      }
    }

  }

  cargarEsteCliente( textoBuscar: string ){ //informes wtf

    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.clienteService.cargarRutinasConTextoYFisio( this.fisioUid, this.posicionactual, textoBuscar )
      .subscribe( res => {


        if (res['rutinasCliente'].length === 0) {

          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarEsteCliente(this.ultimaBusqueda);
          } else {
            this.rutinas = [];
            this.totalRutinas = 0;
          }
        } else {
          this.rutinas = res['rutinasCliente'];

           this.totalRutinas = res['page'].total;

        }
        for (let index = 0; index < this.rutinas.length; index++) {
          if(this.rutinas[index].rutina.fisio_asignado == this.fisioUid){
            this.rutinasFiltradas.push(this.rutinas[index].rutina);
            this.RutinaAux.push({activo:this.rutinas[index].activo, duracion:this.rutinas[index].duracion, veces_realizada:this.rutinas[index].veces_realizada});
          }
        }

        for(var i=0;i<this.rutinasFiltradas.length;i++){
          this.RutinaReal.push(this.rutinasFiltradas[i]);
        }

        //cargar solo rutinas activas

        for(var i=0;i<this.RutinaAux.length;i++){
          if(this.RutinaAux[i].activo){
            this.RutinaActiva.push(this.RutinaReal[i]);
            this.RutinaAuxActiva.push(this.RutinaAux[i]);
          }
        }
        //inicializamos primero todas para mostrar todas
        this.RutinaMostrar=this.RutinaReal;
        this.RutinaAuxMostrar=this.RutinaAux;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
}

  btnClick= function (uid) {
    this.router.navigateByUrl('/player/'+uid);
  };

  ejs(uid){
    this.ejercicios = [];
    this.loading=true;
    this.rutinaService.obtenerEjerciciosRutina(uid)
        .subscribe( res => {
          if (res['ejerciciosRutina'].length === 0) {
           this.loading = false;
          }
          this.ejercicios = res['ejerciciosRutina'];
          this.loading=false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });
  }


  recargar(nombre, uid){
    this.fisioUid = uid;
    this.fisioAhora = nombre;
    this.ngOnInit();

  }

}
