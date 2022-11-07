import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] =[
    { titulo: 'Dashboard Admin', icono: 'fa fa-tachometer-alt', sub: false, url: '/admin/dashboard'},
    { titulo: 'Gestión usuarios', icono: 'fa fa-users', sub: false, url: '/admin/usuarios'},
    { titulo: 'Estadisticas', icono: 'fas fa-chart-line', sub: false, url: '/admin/estadisticas'},
    // { titulo: 'Motor gráfico', icono: 'fas fa-cubes', sub: false, url: '/admin/motor-grafico'},
    { titulo: 'Ejercicios', icono: 'fas fa-cubes', sub: false, url: '/admin/ejercicios'},
  ];

  menuCliente: sidebarItem[]=[
    { titulo: 'Dashboard Cliente', icono: 'fa fa-tachometer-alt', sub: false, url: '/cliente/dashboard'},
  ];

  menuFisio: sidebarItem[]=[
    { titulo: 'Dashboard Fisioterapeuta', icono: 'fa fa-tachometer-alt', sub: false, url: '/fisio/dashboard'},
    { titulo: 'Gestionar Clientes', icono: 'fa fa-users', sub: false, url: '/fisio/clientes'},
    { titulo: 'Informes', icono: 'fas fa-scroll', sub: false, url: '/fisio/informes'},
    { titulo: 'Rutinas', icono: 'fas fa-table', sub: false, url: '/fisio/rutinas'},
    { titulo: 'Plan Mensual', icono: 'fas fa-file-invoice-dollar', sub: false, url: '/fisio/plan-mensual'},
  ];

  none: sidebarItem[]=[
    { titulo: 'error', icono: 'fa fa-exclamation-triangle', sub: false, url: '/error'}
  ]
  constructor( private usuarioService: UsuarioService) { }

  getmenu() {

    switch (this.usuarioService.rol) {
      case 'ROL_ADMIN':
        return this.menuAdmin;
      case 'ROL_FISIO':
        return this.menuFisio;
      case 'ROL_CLIENTE':
        return this.menuCliente;
    }

    return this.none;
  }
}
