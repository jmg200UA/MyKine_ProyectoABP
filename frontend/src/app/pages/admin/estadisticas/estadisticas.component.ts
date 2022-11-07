import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../../services/usuario.service';
import { ClienteService } from '../../../services/cliente.service';
import { Usuario } from '../../../models/usuario.model';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']

})
export class EstadisticasComponent implements OnInit {


  //ATRIBUTOS
  public listaUsuarios: Usuario[] = [];
  public listaClientes: Cliente[] = [];
  public fisios = 0;
  public clientes = 0;
  public total_usuarios = 0;
  public total_usuarios_clientes = 0;
  public facturacion_mensual;

  public mes;

  public gratis = 0;
  public estandar = 0;
  public premium = 0;
  public planesMensuales: number[] = [];
  public especialidades: number[] = [];

  public fechaseparada = [];
  public listaMeses = [];
  public listaMesesClientes = [];

  //Especialidades
  public pediatria: number = 0;
  public neurologia: number = 0;
  public geriatria: number = 0;
  public deportiva: number = 0;
  public general: number = 0;


  //Estos datos hay que traerselos de GOOGLE ANALYTICS
  graficaUsuarios = [
    {
    data: [ 28,276,22,41,23,20 ],
    label: 'Tráfico total',
    backgroundColor: 'green'
  },
  {
    data: [ 6,26,8,12,12,8 ],
    label: 'Tráfico orgánico',
    backgroundColor: 'orange'
  }
  ];
  traficoWeb: string[] = ['Diciembre','Enero', 'Febrero','Marzo','Abril','Mayo'];

  facturacionPorMes = [

  ];
  factLabel: string[] = ['Septiembre','Octubre','Noviembre','Diciembre','Enero', 'Febrero','Marzo','Abril'];



  //Porcentaje trafico organico
  public porcentajeTrafico: number[] = [16, 84];
  public colorsTrafico: Color[] = [
    {
      backgroundColor: [
        'orange',
        'green',
      ]
    }
  ];

  public usuariosClientes = [];
  usuariosClientesLabels: string[] = ['Septiembre','Octubre','Noviembre','Diciembre','Enero', 'Febrero','Marzo','Abril'];

  public colorsEspecialidad: Color[] = [
    {
      backgroundColor: [
        '#10002b',
        '#5a189a',
        '#9d4edd',
        '#e0aaff',
        '#c8e7ff',
      ]
    }
  ];

  public colorsPlanes: Color[] = [
    {
      backgroundColor: [
        '#641220',
        '#c1121f',
        '#bb8588',
      ]
    }
  ];


  constructor(private ususuarioService: UsuarioService,
              private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.usuariosPlanes();
    this.obtenerClientes();
  }

  usuariosPlanes() {
    this.ususuarioService.cargarUsuariosTodos()
      .subscribe( res => {

        this.listaUsuarios = res['usuarios'];

        var i:number;

        var febrero_total = 0;
        var feb_fact = 0;
        var enero_total = 0;
        var ene_fact = 0;
        var diciembre_total = 0;
        var dic_fact = 0;
        var noviembre_total = 0;
        var nov_fact = 0;
        var octubre_total = 0;
        var oct_fact = 0;
        var septiembre_total = 0;
        var sept_fact = 0;
        var agosto_total = 0;
        var julio_total = 0;
        var junio_total = 0;
        var mayo_total = 0;
        var may_fact = 0;
        var abril_total = 0;
        var abr_fact = 0;
        var marzo_total = 0;
        var mar_fact = 0;


        for(i = 0;i<this.listaUsuarios.length;i++) {

          const fecha = this.listaUsuarios[i].alta.toString();

          this.fechaseparada = fecha.split("-");
          this.mes = parseInt(this.fechaseparada[1]);

          //Fisios con plan GRATUITO
          if(this.listaUsuarios[i].planMensual == "Gratis"){
            this.gratis++; //Sumamos 1 al numero de FISIOS con plan gratuito
          }

          //Fisios con plan ESTANDAR
          if(this.listaUsuarios[i].planMensual == "Estandar"){
            this.estandar++; //Sumamos 1 al numero de FISIOS con plan gratuito


            //Filtrar facturación por mes
            switch (this.mes) {
              case 9:
                sept_fact+= 24.99;
                break;
              case 10:
                oct_fact+= 24.99;
                break;
              case 11:
                nov_fact+= 24.99;
                break;
              case 12:
                dic_fact+= 24.99;
                break;
              case 1:
                ene_fact+= 24.99;
                break;
              case 2:
                feb_fact+= 24.99;
                break;
              case 3:
                mar_fact+= 24.99;
                break;
              case 4:
                abr_fact+= 24.99;
                break;
              case 5:
                may_fact+= 24.99;
                break;

              default:
                break;
            }

          }

          //Fisios con plan PREMIUM
          if(this.listaUsuarios[i].planMensual == "Premium"){
            this.premium++; //Sumamos 1 al numero de FISIOS con plan gratuito

            switch (this.mes) {
              case 9:
                sept_fact+= 39.99;
                break;
              case 10:
                oct_fact+= 39.99;
                break;
              case 11:
                nov_fact+= 39.99;
                break;
              case 12:
                dic_fact+= 39.99;
                break;
              case 1:
                ene_fact+= 39.99;
                break;
              case 2:
                feb_fact+= 39.99;
                break;
              case 3:
                mar_fact+= 39.99;
                break;
              case 4:
                abr_fact+= 39.99;
                break;
              case 5:
                may_fact+= 39.99;
                break;

              default:
                break;
            }
          }

          //FISIOS POR ESPECIALIDAD

          //Fisios pediatras
          if(this.listaUsuarios[i].especialidad == "pediatria"){
            this.pediatria++;
          }
          //Fisios neurologos
          if (this.listaUsuarios[i].especialidad == "neurologia"){
            this.neurologia++;
          }
          //Fisios geriatria
          if (this.listaUsuarios[i].especialidad == "geriatria"){
            this.geriatria++;
          }
          //Fisios deportivo
          if (this.listaUsuarios[i].especialidad == "deportiva"){
            this.deportiva++;
          }
          //Fisios general
          if (this.listaUsuarios[i].especialidad == "general"){
            this.general++;
          }

          //Numero de fisios
          if(this.listaUsuarios[i].rol == "ROL_FISIO"){
            this.fisios++; //Sumamos 1 al numero de FISIOS
          }

          //Numero total de ususarios
          this.total_usuarios++;

          //Separar fisios por mes


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
        this.planesMensuales[0] = this.gratis;
        this.planesMensuales[1] = this.estandar;
        this.planesMensuales[2] = this.premium;

        this.especialidades[0] = this.pediatria;
        this.especialidades[1] = this.neurologia;
        this.especialidades[2] = this.geriatria;
        this.especialidades[3] = this.deportiva;

        let oct_total = sept_fact + oct_fact;
        let nov_total = nov_fact + oct_total;
        let dic_total = dic_fact + nov_total;
        let ene_total = ene_fact + dic_total;
        let feb_total = feb_fact + ene_total;
        let mar_total = mar_fact + feb_total;
        let abr_total = abr_fact + mar_total;
        let may_total = may_fact + abr_total;

        this.facturacionPorMes = [
          {
            data:[ sept_fact , oct_total, nov_total, dic_total, ene_total, feb_total, mar_total, abr_total, may_total ],
            label: 'Facturación',
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
            fill: 'origin',
          },

        ];


        //Asignar total de meses a lista de meses
        //DICIEMBRE
        this.listaMeses[1] = febrero_total;
        this.listaMeses[0] = enero_total;
        this.listaMeses[11] = diciembre_total;
        this.listaMeses[10] = noviembre_total;
        this.listaMeses[9] = octubre_total;
        this.listaMeses[8] = septiembre_total;
        this.listaMeses[7] = agosto_total;
        this.listaMeses[6] = julio_total;
        this.listaMeses[5] = junio_total;
        this.listaMeses[4] = mayo_total;
        this.listaMeses[3] = abril_total;
        this.listaMeses[2] = marzo_total;

        //Facturacion mensual
        this.facturacion_mensual = ((this.estandar*24.99)+(this.premium*39.99)).toFixed(2);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
      });
  }

  obtenerClientes() {
    this.clienteService.cargarClientesTodos()
      .subscribe( res => {

        this.listaClientes = res['clientes'];

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

          //Numero total de ususarios
          this.clientes++;

          //Separar fisios por mes
          const fecha = this.listaClientes[i].alta.toString();

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

        //Calcular numero total de usuarios+clientes
        this.total_usuarios_clientes = this.total_usuarios+this.clientes;

        this.usuariosClientes = [
          {
            data:[ this.listaMeses[8], this.listaMeses[9], this.listaMeses[10],this.listaMeses[11],this.listaMeses[0],this.listaMeses[1],this.listaMeses[2],this.listaMeses[3] ],
            label: 'Fisioterapeutas',
            backgroundColor: '#0740ba'
          },
          {
            data: [septiembre_total, octubre_total ,noviembre_total,diciembre_total,enero_total,febrero_total,marzo_total,abril_total ],
            label: 'Pacientes',
            backgroundColor: '#e0991d'
          }
        ];

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
      });
  }

}
