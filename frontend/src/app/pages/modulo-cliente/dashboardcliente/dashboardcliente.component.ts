import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { Usuario } from '../../../models/usuario.model';
import { Cliente } from '../../../models/cliente.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InformesClienteComponent } from '../informes-cliente/informes-cliente.component';
import { RutinasClienteComponent } from '../rutinas-cliente/rutinas-cliente.component';
import { HistorialclienteComponent } from '../historialcliente/historialcliente.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboardcliente',
  templateUrl: './dashboardcliente.component.html',
  styleUrls: ['./dashboardcliente.component.css']
})
export class DashboardclienteComponent implements OnInit {

  @ViewChild(InformesClienteComponent) hijo: InformesClienteComponent;

  @ViewChild(RutinasClienteComponent) hijo2: RutinasClienteComponent;

  @ViewChild(HistorialclienteComponent) hijo3: HistorialclienteComponent;


  constructor( private clienteService: ClienteService ) {
    this.isOn = 0;
   }

  //ATRIBUTOS
  public isOn = 0;
  public listaFisios: Usuario[] = [];
  public totalFisios;
  public nombreFisio;
  public nombresFisio: String[] = [];
  public selectedValue;
  public NOMBRE;
  public fisioUid;

  public imagenUrl= ""; // variable para la carga de su imagen de perfil

  public clienteperfil; // donde guardaremos la info del cliente para mostrarla


  ngOnInit(): void {
    this.cargarDatosCliente();
    this.cargarFisios();
    // document.getElementById("chatbot").hidden = false;



    // Esto mismo para cliente para cargar su imagen de perfil
    // this.usuarioService.cargarUsuario( this.usuarioService.uid )
    // .subscribe( res => {
    //   this.imagenUrl = `${environment.base_url}/upload/fotoperfil/`+res['usuarios'].imagen || 'no-imagen';
    //   this.imagenUrl+= `?token=${this.usuarioService.token}`;
    // });
    // }else{
    //   this.clienteService.cargarCliente(this.clienteService.uid)
    //   .subscribe( res => {
    //     this.imagenUrl = `${environment.base_url}/upload/fotoperfil/`+res['clientes'].imagen || 'no-imagen';
    //     this.imagenUrl+= `?token=${this.clienteService.token}`;
    //   });
    // }

  }


  cargarFisios(){

    this.clienteService.cargarListaFisios()
      .subscribe( res => {

          this.listaFisios = res['fisios'];

          this.totalFisios = res['page'].total;
          this.nombreFisio = this.listaFisios[0].nombre_apellidos;



          for (let i = 0; i < this.listaFisios.length; i++) {
            this.nombresFisio[i]=this.listaFisios[i].nombre_apellidos;

          }

          this.NOMBRE = this.listaFisios[this.listaFisios.length-1].nombre_apellidos;
          this.fisioUid = this.listaFisios[this.listaFisios.length-1].uid;

          this.recargar('',1);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });

  }

  //funcion para cargar los datos del cliente actual, para poder cargar la imagen de perfil..
  cargarDatosCliente():void{
    //llamada al backend para cargar los datos del cliente logueado, gracias a su token
    this.clienteService.cargarClientes(0,'') // mandamos los parametros desde y paginacion vacios porque solo queremos el cliente
      .subscribe( res => {
        this.clienteperfil= res['page']['clientes'];
        const dfMessenger = document.querySelector('df-messenger');
        dfMessenger.setAttribute("user-id",this.clienteperfil.uid);
    this.imagenUrl = this.clienteService.crearImagenUrl(this.clienteperfil.imagen);

      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      });
  }

  recargar(seleccion, num){
    if(num==1){
      this.hijo2.recargar(this.NOMBRE, this.fisioUid);
      //this.hijo.recargar(this.NOMBRE, this.fisioUid);
    }
    else{
      var splitted = seleccion.split(": ",2);
      this.NOMBRE = splitted[1];

      //Recargar el uid si se cambia el selector
      for (let i = 0; i < this.listaFisios.length; i++) {
        //NO SE PUEDE HACER CON NOMBRES (PORQUE SE REPITEN), HAY QUE
        //BUSCAR LA FORMA DE HACERLO CON EMAIL O UID
        if(this.listaFisios[i].nombre_apellidos == this.NOMBRE){
          this.fisioUid = this.listaFisios[i].uid;
        }
      }

      //Habría que hacer estos dos 'recargar' a la vez , pero si no pones este ifelse o uno u otro da error
      if(this.isOn==1){
        this.hijo.recargar(this.NOMBRE, this.fisioUid);
      }else if(this.isOn==0){
        this.hijo2.recargar(this.NOMBRE, this.fisioUid);
      }
      else if(this.isOn==2){ // ver la logica por que no carga
        this.hijo3.recargar(this.NOMBRE, this.fisioUid);
      }
    }

  }

  logout() {
    this.clienteService.logout();
  }
}
