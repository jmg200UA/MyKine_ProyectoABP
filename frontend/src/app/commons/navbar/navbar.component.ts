import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../services/usuario.service';
import { ClienteService } from '../../services/cliente.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  imagenUrl: string = '';

  constructor( private usuarioService: UsuarioService,
               private clienteService: ClienteService) { }

  ngOnInit(): void {
    if(this.usuarioService.rol == 'ROL_ADMIN' || this.usuarioService.rol == 'ROL_FISIO'){
    this.usuarioService.cargarUsuario( this.usuarioService.uid )
    .subscribe( res => {
      this.imagenUrl = `${environment.base_url}/upload/fotoperfil/`+res['usuarios'].imagen || 'no-imagen';
      this.imagenUrl+= `?token=${this.usuarioService.token}`;
    });
    }else{
      this.clienteService.cargarCliente(this.clienteService.uid)
      .subscribe( res => {
        this.imagenUrl = `${environment.base_url}/upload/fotoperfil/`+res['clientes'].imagen || 'no-imagen';
        this.imagenUrl+= `?token=${this.clienteService.token}`;
      });
    }
  }

  logout() {
    this.usuarioService.logout();
  }
}
