import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { RutinaService } from '../../../services/rutinas.service';
import { environment } from '../../../../environments/environment.prod';
import { Cliente } from '../../../models/cliente.model';
import { Rutina } from '../../../models/rutina.models';
import Swal from 'sweetalert2';
import { PdfMakeWrapper, Txt, TextReference } from 'pdfmake-wrapper';

declare function linesChart(gratis, estandar, premium, listaMeses, listaMesesClientes);

@Component({
  selector: 'app-dashboardfisio',
  templateUrl: './dashboardfisio.component.html',
  styleUrls: ['./dashboardfisio.component.css']
})
export class DashboardfisioComponent implements OnInit {

  //ATRIBUTOS
  public loading = true;
  public listaClientes: Cliente[] = [];
  public clientes = 0;
  public clientesMax;

  //ATRIBUTOS INFORMES
  public titulo;
  public asunto;
  public clienteinf;
  public contenido;
  public contenidoLength;
  public informe;
  public fisioinf;
  public fechainf;

  public total_informes;

  //ATRIBUTOS RUITINAS
  private ultimaBusqueda = '';
  public totalRutinas = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public listaRutinas: Rutina[] = [];

  //ATRIBUTOS ESTADISTICAS
  public mes;
  public fechaseparada = [];
  public listaMesesClientes = [];
  public totalClientes;
  public porcentajeClientes;
  public valoracionMedia;
  public valoracionMediaPorcentaje;
  public pacientes = [];
  public pacientesLabels: string[] = ['Noviembre','Diciembre','Enero', 'Febrero','Marzo','Abril'];

  constructor(private usuarioService: UsuarioService, private RutinaService: RutinaService) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerInforme();
    this.datosFisio()
    this.cargarUsuario();
    this.cargarRutinas(this.ultimaBusqueda);
  }

  datosFisio(){
    this.totalClientes = this.usuarioService.num_clientes;
  }

  cargarUsuario():void {
    var aux;
    this.usuarioService.cargarUsuario(this.usuarioService.uid)
    .subscribe( res => {
      aux = res['usuarios'].planMensual;

      if(aux == "Gratis"){
        this.clientesMax = 1;
        this.porcentajeClientes = ((this.clientes/1)*100).toFixed(2);
      }
      if(aux == "Estandar"){
        this.clientesMax = 50;
        this.porcentajeClientes = ((this.clientes/50)*100).toFixed(2);
      }
      if(aux == "Premium"){
        this.clientesMax = '∞';
        this.porcentajeClientes = '';
      }
      //Asignar valoraciones
      this.valoracionMedia = res['usuarios'].valoracion;
      this.valoracionMediaPorcentaje = this.valoracionMedia*10;

    });


  }

  obtenerClientes() {
    this.loading = true;

    this.usuarioService.cargarListaClientes()
        .subscribe( res => {

          this.cargarUsuario();


        this.listaClientes = res['clientes'];

        for(var i=0;i<this.listaClientes.length;i++){
          if(this.listaClientes[i].activo){
            this.clientes++;
          }
        }

        var i:number;

        var febrero_total = 0;
        var enero_total = 0;
        var diciembre_total = 0;
        var noviembre_total = 0;
        var octubre_total = 0;
        var septiembre_total = 0;
        var agosto_total = 0;
        var julio_total = 0;
        var junio_total = 0;
        var mayo_total = 0;
        var abril_total = 0;
        var marzo_total = 0;


        for(i = 0;i<this.listaClientes.length;i++) {

          //Separar clientes por mes
          let fecha = this.listaClientes[i].cliente.alta.toString();

          this.fechaseparada = fecha.split("-");
          this.mes = parseInt(this.fechaseparada[1]);


          //MESES
          if(this.mes == 2){
            febrero_total++;
          }
          if(this.mes == 1){
            enero_total++;
          }
          if(this.mes == 12){
            diciembre_total++;
          }
          if(this.mes == 11){
            noviembre_total++;
          }
          if(this.mes == 10){
            octubre_total++;
          }
          if(this.mes == 9){
            septiembre_total++;
          }
          if(this.mes == 8){
            agosto_total++;
          }
          if(this.mes == 7){
            julio_total++;
          }
          if(this.mes == 6){
            junio_total++;
          }
          if(this.mes == 5){
            mayo_total++;
          }
          if(this.mes == 4){
            abril_total++;
          }
          if(this.mes == 3){
            marzo_total++;
          }

        }
        //Aquí ha acabado el for

        //Asignar total de meses a lista de meses de CLIENTES
        this.listaMesesClientes[1] = febrero_total;
        this.listaMesesClientes[0] = enero_total;
        this.listaMesesClientes[11] = diciembre_total;
        this.listaMesesClientes[10] = noviembre_total;
        this.listaMesesClientes[9] = octubre_total;
        this.listaMesesClientes[8] = septiembre_total;
        this.listaMesesClientes[7] = agosto_total;
        this.listaMesesClientes[6] = julio_total;
        this.listaMesesClientes[5] = junio_total;
        this.listaMesesClientes[4] = mayo_total;
        this.listaMesesClientes[3] = abril_total;
        this.listaMesesClientes[2] = marzo_total;

        this.pacientes = [
          {
            data: [noviembre_total, diciembre_total, enero_total, febrero_total, marzo_total, abril_total ],
            label: 'Pacientes',
            backgroundColor: '#195ae6'
          }
        ];

        this.loading = false;
        linesChart(0, 0, 0, 0, this.listaMesesClientes);

          }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });
  }

  obtenerInforme(){
    this.usuarioService.cargarInformesFisio()
        .subscribe( res => {

          this.informe = res['informesFisio'];

          var ult = this.informe.length - 1;

          if(ult!=-1){
            this.titulo = this.informe[ult].titulo;

            this.asunto = this.informe[ult].asunto;

            this.clienteinf = this.informe[ult].cliente_asociado.nombre_apellidos;

            this.fisioinf = this.informe[ult].fisio_asociado;

            this.contenido = this.informe[ult].contenido;

            this.contenidoLength = this.contenido.length;

            this.fechainf = this.informe[ult].fecha;

            this.total_informes = this.informe.length;

          }



          }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });
  }

  generarPDF(bol: boolean){
    const pdf = new PdfMakeWrapper();
    var fecha = this.fechainf.toString();
    var fechaseparada = [];
    fechaseparada = fecha.split("T");
    fecha = fechaseparada[0];
    let tituloinf: string = "Informe de fecha " + fecha;
    let saltolinea: string = '\n';

    pdf.info({
      title: 'Informe - '+tituloinf,
      author: this.fisioinf,
      subject: this.clienteinf,
    });

    pdf.defaultStyle({
      fontSize: 15
    });

    pdf.add(
      new Txt(this.titulo).alignment('center').italics().fontSize(40).bold().end
    );
    pdf.add(saltolinea);

    pdf.add(saltolinea);
    pdf.add(saltolinea);
    pdf.add(saltolinea);
    pdf.add(
      new Txt(this.contenido).alignment('center').italics().end
    );

    if(bol){
      pdf.create().open(); // para simplemente abrir
    }
    else pdf.create().download(); // para descargar
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
          }
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          this.loading = false;
        });
  }

}
