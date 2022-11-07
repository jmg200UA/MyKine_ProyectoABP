import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Informe } from '../../../models/informe.model';
import Swal from 'sweetalert2';
import { ConstantPool } from '@angular/compiler';
import { UsuarioService } from '../../../services/usuario.service';
import { InformeService } from '../../../services/informe.service';
import { PdfMakeWrapper, Txt, TextReference } from 'pdfmake-wrapper';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  //ATRIBUTOS PUBLICOS
  public loading = true;

  public totalInformes = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaInformes: Informe[] = [];

  constructor( private UsuarioService: UsuarioService,
    private informeService: InformeService ) { }

  ngOnInit(): void {
    this.cargarInformesConTexto(this.ultimaBusqueda);
  }

  cargarInformesConTexto( textoBuscar: string ){

      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.UsuarioService.cargarInformesConTexto( this.posicionactual, textoBuscar )
        .subscribe( res => {
          if (res['informesFisio'].length === 0) {

            if (this.posicionactual > 0) {
              this.posicionactual = this.posicionactual - this.registrosporpagina;
              if (this.posicionactual < 0) { this.posicionactual = 0};
              this.cargarInformesConTexto(this.ultimaBusqueda);
            } else {
              this.listaInformes = [];
              this.totalInformes = 0;
            }
          } else {
            this.listaInformes = res['informesFisio'];

            this.totalInformes = res['page'].total;

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
                this.cargarInformesConTexto(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                console.warn('error:', err);
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

}
