import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { InformeService } from '../../../services/informe.service';
import { Informe } from '../../../models/informe.model';
import { environment } from '../../../../environments/environment';
import { DashboardclienteComponent } from '../dashboardcliente/dashboardcliente.component';
import Swal from 'sweetalert2';
import { Rutina } from 'src/app/models/rutina.models';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';

@Component({
  selector: 'app-historialcliente',
  templateUrl: './historialcliente.component.html',
  styleUrls: ['./historialcliente.component.css']
})
export class HistorialclienteComponent implements OnInit {

  //Nombre fisio pasado por componente
  @Input() fisioAhora: '';

  //Uid fisio pasado por componente
  @Input() fisioUid: '';

  //ATRIBUTOS GENERALES
  public loading = true;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;


  //ATRIBUTOS RUTINAS
  public rutinas;

  public rutinasFiltradas: Rutina[]=[];

  public RutinaDefinitiva: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; //esta es la buena falta añadirle la fecha

  //ATRIBUTOS INFORMES
  private ultimaBusqueda = '';
  public listaInformes: Informe[] = []; // hay que ponerle los campos que queremos (nombre, fecha,tipo "informe")
  public informesHistorial:  {nombre:string, uid:string, tipo:string, fecha:string}[]= [];

  //ATRIBUTOS HISTORIAL
  public infohistorialinf: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; // array donde estaran todas las rutinas e informes que el fisio mande al cliente, primero informes
  public infohistorialrut: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; // array donde estaran todas las rutinas e informes que el fisio mande al cliente, primero rutinas
  public infohistorialrec: {nombre:string, uid:string, tipo:string, fecha:Date}[]= []; // array donde estaran todas las rutinas e informes que el fisio mande al cliente, ordenado por más reciente
  public infohistorialrecform: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; // array recientes con formato string fecha
  public infohistorial: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; // array historial general
  public infohistorialfechas: {nombre:string, uid:string, tipo:string, fecha:string}[]= []; // array historial general

  public numfiltro=2; //variable para saber el filtro




  constructor( private clienteService: ClienteService,
              private informeService: InformeService,
              private fb: FormBuilder,
              private router: Router,
              private datePipe: DatePipe ) {
                this.numfiltro=2;
               }

              public datosForm = this.fb.group({ // para obtener el numero del filtro a aplicar
                selectfiltro: [''],
                fecha1: [''],
                fecha2: ['']
              });


  ngOnInit(): void {
    // document.getElementById("chatbot").hidden = false;
    //inicializamos los arrays a vacío para cuando se haga la recarga a otro fisio
    this.rutinasFiltradas= [];
    this.RutinaDefinitiva= [];
    this.infohistorialrut= [];
    this.informesHistorial= [];
    this.infohistorialrut= [];
    this.infohistorialinf= [];
    this.infohistorialrec= [];
    this.infohistorialrecform= [];
    this.cargarHistorial();

    this.cambiarFiltro(4);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  cambiarFiltro(num){ // num solo se le pasará y con valor 3 cuando sea el filtro de las fechas
    var filtro=this.datosForm.get('selectfiltro').value;
    if(num==3){ // para ordenar por fechas
      this.infohistorialfechas = [];
      this.numfiltro=num;
      var f1=this.datosForm.get('fecha1').value;
      var f2=this.datosForm.get('fecha2').value;
      var fecha1=new Date(f1);
      var fecha2=new Date(f2);
      if(!f1 || !f2){ // si lo comprobamos con los dates da invalid
        // notificacion de que debe introducir las dos fechas
        Swal.fire({icon: 'error', title: 'Error introduciendo fechas', text: 'Debes introducir las dos fechas para filtrar'});
      }

      for(let i=0; i<this.infohistorialrec.length;i++){
        if(fecha1<=this.infohistorialrec[i].fecha && fecha2>=this.infohistorialrec[i].fecha){
          this.infohistorialfechas.push(this.infohistorialrecform[i]);
        }
      }
      this.infohistorial=this.infohistorialfechas;

    }
    else if(filtro){
      this.numfiltro=filtro;
      if(filtro==0){ // para ordenar rutinas primero
        this.infohistorial=this.infohistorialrut;
      }
      else if(filtro==1){ // para ordenar informes primero
        this.infohistorial=this.infohistorialinf;
      }
      else if(filtro==2){ // para ordenar por más recientes
        this.infohistorial=this.infohistorialrecform;
      }
    }
    else if(this.numfiltro==2){
      this.infohistorial=this.infohistorialrecform;
    }
  }

  cargarHistorial(){ // cargar historial de informes y rutinas mandadas por el fisio al cliente
    this.cargarEsteCliente();
}



  //Funcion para cargar información de las rutinas de este cliente
  cargarEsteCliente(){
    this.loading = true;
    this.clienteService.cargarRutinasCliente()
    .subscribe( res =>{
      this.rutinas = res['rutinas'];

      for (let index = 0; index < this.rutinas.length; index++) {
        if(this.rutinas[index].rutina.fisio_asignado == this.fisioUid){
          this.rutinasFiltradas.push(this.rutinas[index].rutina);
        }
      }

      for(var i=0;i<this.rutinasFiltradas.length;i++){
        let date="";
        date=this.rutinasFiltradas[i].fecha.toString();
        let fechasplit = date.split("T", 2);
        this.RutinaDefinitiva.push({nombre:this.rutinasFiltradas[i].nombre, uid:this.rutinasFiltradas[i].uid, tipo:"rutina", fecha:fechasplit[0]});
      }

      for(var i=0;i<this.RutinaDefinitiva.length;i++){
        this.infohistorialrut.push({nombre:this.RutinaDefinitiva[i].nombre, uid:this.RutinaDefinitiva[i].uid, tipo:"rutina", fecha:this.RutinaDefinitiva[i].fecha});
      }

      this.cargarInformesConTextoYFisio();
      this.loading=false;
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });
  }

  //funcion para cargar la informacion de los informes que le ha mandado determinado fisio al cliente
  cargarInformesConTextoYFisio(){

    this.loading = true;
    this.clienteService.cargarInformesConTextoYFisio( this.fisioUid, this.posicionactual, "" )
      .subscribe( res => {
        if (res['informesCliente'].length === 0) {

          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarInformesConTextoYFisio();
          } else {
            this.listaInformes = [];
          }
        } else {
          this.listaInformes = res['informesCliente'];

          for(var i=0;i<this.listaInformes.length;i++){
            let date="";
            date=this.listaInformes[i].fecha.toString();
            let fechasplit = date.split("T", 2);
            this.informesHistorial.push({nombre:this.listaInformes[i].titulo, uid:this.listaInformes[i].uid, tipo:"informe", fecha:fechasplit[0]});
          }
          //array rutinas primero
          for(var i=0;i<this.informesHistorial.length;i++){
            this.infohistorialrut.push({nombre:this.informesHistorial[i].nombre, uid:this.informesHistorial[i].uid, tipo:"informe", fecha:this.informesHistorial[i].fecha});
          }
          //array informes primero
          for(let i=this.infohistorialrut.length-1;i>=0;i--){
            this.infohistorialinf.push(this.infohistorialrut[i]);
          }

          for(var i=0;i<this.infohistorialrut.length;i++){
            this.infohistorialrec.push({nombre:this.infohistorialrut[i].nombre, uid:this.infohistorialrut[i].uid, tipo:this.infohistorialrut[i].tipo, fecha:new Date(this.infohistorialrut[i].fecha)});
          }

          //ordenamos por fecha de más reciente a más antiguo
          this.infohistorialrec.sort(
            (objB, objA) => objA.fecha.getDate() - objB.fecha.getDate(), //esto ordena por día
          );
          this.infohistorialrec.sort(
            (objB, objA) => objA.fecha.getMonth() - objB.fecha.getMonth(), // esto ordena por mes
          );
          this.infohistorialrec.sort(
            (objB, objA) => objA.fecha.getFullYear() - objB.fecha.getFullYear(), // esto ordena por año
          );

          // volvemos a pasar la fecha a string para poder mostrarla en el formato bueno y almacenamos el array ordenado
          // en el array general "this.infohistorial" que es el que se muestra
          for(var i=0;i<this.infohistorialrec.length;i++){
            let date=this.datePipe.transform(this.infohistorialrec[i].fecha,"yyyy-MM-dd");
            let datestring="";
            datestring=date.toString();

            this.infohistorialrecform.push({nombre:this.infohistorialrec[i].nombre, uid:this.infohistorialrec[i].uid, tipo:this.infohistorialrec[i].tipo, fecha:datestring});
          }

        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        this.loading = false;
      });
}

btnClick= function (uid) { // para redireccionar al player de la rutina directamente
  this.router.navigateByUrl('/player/'+uid);
};

generarPDF(uid: string, bol: boolean){ // para poder ver los pdf de los informes
  let informe;
  this.informeService.obtenerInforme(uid)
    .subscribe( res =>{
      informe = res['informes'];

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
      this.loading=false;
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      this.loading = false;
    });

}

cambiarPagina( pagina: number ){
  pagina = (pagina < 0 ? 0 : pagina);
  this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
}

recargar(nombre, uid){
  this.fisioUid = uid;
  this.fisioAhora = nombre;
  this.ngOnInit();
}

}
