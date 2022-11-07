import { Component, OnInit, Input,} from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { Informe } from '../../../models/informe.model';
import { environment } from '../../../../environments/environment';
import { PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-informes-cliente',
  templateUrl: './informes-cliente.component.html',
  styleUrls: ['./informes-cliente.component.css']
})
export class InformesClienteComponent implements OnInit {


  //Nombre fisio pasado por componente
  @Input() fisioAhora: '';

  //Uid fisio pasado por componente
  @Input() fisioUid: '';


  //ATRIBUTOS
  public loading = true;

  public totalInformes = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaInformes: Informe[] = [];
  public message;

  public numfiltro; //variable para saber el filtro

  constructor( private clienteService: ClienteService, private fb: FormBuilder, private datePipe: DatePipe ) { }

  public datosForm = this.fb.group({ // para obtener las fechas entre las que se quiere filtrar
    fecha1: [''],
    fecha2: ['']
  });

  ngOnInit(): void {
    // document.getElementById("chatbot").hidden = false;
    this.cargarInformesConTextoYFisio(this.ultimaBusqueda);
  }

  cambiarFiltro(num){ // num solo se le pasará y con valor 3 cuando sea el filtro de las fechas
    if(num==3){ // para ordenar por fechas
      this.numfiltro=num;
      var f1=this.datosForm.get('fecha1').value;
      var f2=this.datosForm.get('fecha2').value;
      var fecha1=new Date(f1);
      var fecha2=new Date(f2);
      if(!f1 || !f2){ // si lo comprobamos con los dates da invalid
        // notificacion de que debe introducir las dos fechas
        Swal.fire({icon: 'error', title: 'Error introduciendo fechas', text: 'Debes introducir las dos fechas para filtrar'});
      }
      let auxfechas = this.listaInformes;
      let faux;
      this.listaInformes= [];

      for(let i=0; i<auxfechas.length;i++){
        faux= new Date(auxfechas[i].fecha);
        if(fecha1<=faux && fecha2>=faux){
          this.listaInformes.push(auxfechas[i]);
        }
      }

    }
  }

  cargarInformesConTextoYFisio( textoBuscar: string ){

    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.clienteService.cargarInformesConTextoYFisio( this.fisioUid, this.posicionactual, textoBuscar )
      .subscribe( res => {
        if (res['informesCliente'].length === 0) {

          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarInformesConTextoYFisio(this.ultimaBusqueda);
          } else {
            this.listaInformes = [];
            this.totalInformes = 0;
          }
        } else {
          this.listaInformes = res['informesCliente'];

           this.totalInformes = res['page'].total;

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
  this.cargarInformesConTextoYFisio(this.ultimaBusqueda);
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


recargar(nombre, uid){
  this.fisioUid = uid;
  this.fisioAhora = nombre;
  this.ngOnInit();
}


}
