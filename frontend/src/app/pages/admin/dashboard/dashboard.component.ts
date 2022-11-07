import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  url = 'http://localhost:3000/api/upload/evidencia/hola.txt';

  public totalregistros=5;

  //VARIABLES USUARIO
  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina=5;

  public listaUsuarios: Usuario[] = [];
  public listaUsuariosAux: Usuario[] = [];
  private ultimaBusqueda = '';
  //FIN VARIABLES USUARIO


  //Provisional
  public usuariosClientes = [];
  usuariosClientesLabels: string[] = ['Septiembre','Octubre','Noviembre','Diciembre','Enero', 'Febrero','Marzo','Abril'];


  //Ahora borro los que no hagan falta
  public listaClientes: Cliente[] = [];
  public fisios = 0;
  public clientes = 0;
  public total_usuarios = 0;

  public mes;

  public fechaseparada = [];
  public listaMeses = [];
  public listaMesesClientes = [];

  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  }

  constructor( private usuarioService: UsuarioService,
    private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.url += '?token='+this.usuarioService.token;

    this.cargarUsuarios(this.ultimaBusqueda); //Para usuarios

    this.totalUsuarios();
    this.obtenerClientes();
  }


  //SECCION USUARIOS
  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
          this.listaUsuarios = res['usuarios'].splice(0,5);


      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
      });
  }

  crearImagenUrl(imagen: string) {
    return this.usuarioService.crearImagenUrl(imagen);
  }
  //FIN SECCION USUARIOS

  //PARA LA GRAFICA NUEVA
  totalUsuarios() {
    this.loading = true;
    this.usuarioService.cargarUsuariosTodos()
      .subscribe( res => {

        this.listaUsuariosAux = res['usuarios'];

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


        for(i = 0;i<this.listaUsuarios.length;i++) {

          //Separar fisios por mes
          const fecha = this.listaUsuariosAux[i].alta.toString();

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

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
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
