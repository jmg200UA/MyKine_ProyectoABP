import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { ClienteLayoutComponent } from '../layouts/cliente-layout/cliente-layout.component';
import { NuevoinicioLayoutComponent } from '../layouts/nuevoinicio-layout/nuevoinicio-layout.component';

import { RecoveryComponent } from '../auth2/recovery/recovery.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LandingComponent } from './inicio-nuevo-module/landing/landing.component';

import { EjercicioComponent } from './admin/ejercicio/ejercicio.component';
import { EjerciciosComponent } from './admin/ejercicios/ejercicios.component';


import { EstadisticasComponent } from './admin/estadisticas/estadisticas.component';


import { DashboardfisioComponent } from './modulo-fisio/dashboardfisio/dashboardfisio.component';
import { InformeComponent } from './modulo-fisio/informe/informe.component';
import { InformesComponent } from './modulo-fisio/informes/informes.component';
import { RutinasComponent } from './modulo-fisio/rutinas/rutinas.component';
import { RutinaComponent } from './modulo-fisio/rutina/rutina.component';
import { GestionarclientesComponent } from './modulo-fisio/gestionarclientes/gestionarclientes.component';
import { ClienteComponent } from './modulo-fisio/cliente/cliente.component';
import { ClientenuevoComponent } from './modulo-fisio/clientenuevo/clientenuevo.component';

import { DashboardclienteComponent } from './modulo-cliente/dashboardcliente/dashboardcliente.component';
import { BusquedaComponent } from './inicio-nuevo-module/busqueda/busqueda.component';
import { FisioComponent } from './inicio-nuevo-module/fisio/fisio.component';
import { PlanmensualComponent } from './modulo-fisio/planmensual/planmensual.component';
import { PlayerRutinasComponent } from './modulo-cliente/player-rutinas/player-rutinas.component';
import { ReestablecerPasswordComponent } from './modulo-cliente/reestablecer-password/reestablecer-password.component';
import { PerfilclienteComponent } from './modulo-cliente/perfilcliente/perfilcliente.component';


const routes: Routes = [
  { path: 'perfil', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: PerfilComponent, data: {
                                    titulo: 'Perfil',
                                    breadcrums: []
                                  },},
    ]},

  { path: 'landing', component: NuevoinicioLayoutComponent,
  children: [
    { path: '', component: LandingComponent, data: {
                                  titulo: 'Landing',
                                  breadcrums: []
                                },},
    { path: 'busqueda', component: BusquedaComponent, data: {
                                  titulo: 'Busqueda',
                                  breadcrums: []
                                },},
    { path: 'busqueda/:localizacion', component: BusquedaComponent, data: {
                                  titulo: 'Busqueda',
                                  breadcrums: []
                                },},
    { path: 'busqueda/:localizacion/:especialidad', component: BusquedaComponent, data: {
                                  titulo: 'Busqueda',
                                  breadcrums: []
                                },},
    { path: 'fisio/:id', component: FisioComponent, data: {
                                  titulo: 'Fisio',
                                  breadcrums: []
                                },},
    // Recovery
  { path: 'recovery/:uid', component: RecoveryComponent, data: {
                                  titulo: 'Recuperar Contraseña',
                                  breadcrums: []
                                },},
  ]},



  { path: 'admin', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'ROL_ADMIN'},
    children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: '¡Bienvenido Administrador!',
                                                        breadcrums: []
                                                      },},
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuarios',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'usuarios/usuario/:uid', component: UsuarioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Usuario',
                                                        breadcrums: [ {titulo: 'Usuarios', url: '/admin/usuarios'} ],
                                                      },},

    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Estadisticas',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'ejercicios/ejercicio/:uid', component: EjercicioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Ejercicio',
                                                        breadcrums: [ {titulo: 'Ejercicios', url: '/fisio/ejercicios'}],
                                                  },},
    { path: 'ejercicios', component: EjerciciosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_ADMIN',
                                                        titulo: 'Ejercicios',
                                                        breadcrums: [ ],
                                                      },},

    { path: '**', redirectTo: 'dashboard'}
  ]},

  //APARTADO PARA FISIOTERAPEUTA
  { path: 'fisio', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: 'ROL_FISIO'},
    children: [
    { path: 'dashboard', component: DashboardfisioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Dashboard Fisioterapeuta',
                                                        breadcrums: [],
                                                      },},

    { path: 'clientes', component: GestionarclientesComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Clientes',
                                                        breadcrums: [],
    },},

    { path: 'clientes/cliente/:uid', component: ClienteComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Cliente',
                                                        breadcrums: [ {titulo: 'Clientes', url: '/fisio/clientes'} ],
    },},

    { path: 'clientes/clientenuevo', component: ClientenuevoComponent, canActivate: [ AuthGuard ], data: {
      rol: 'ROL_FISIO',
      titulo: 'Cliente Nuevo',
      breadcrums: [ {titulo: 'Clientes', url: '/fisio/clientes'} ],
    },},

    { path: 'informes', component: InformesComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Informes',
                                                        breadcrums: []
                                                      },},

    { path: 'informes/informe/:uid', component: InformeComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Informe',
                                                        breadcrums:  [{titulo: 'Informes', url: '/fisio/informes'} ]
                                                      },},

    { path: 'rutinas', component: RutinasComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Rutinas',
                                                        breadcrums: []
                                                      },},
    { path: 'rutinas/rutina/:uid', component: RutinaComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Rutina',
                                                        breadcrums:  [{titulo: 'Rutinas', url: '/fisio/rutinas'} ]
                                                      },},
    { path: 'plan-mensual', component: PlanmensualComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ROL_FISIO',
                                                        titulo: 'Plan Mensual',
                                                        breadcrums: []
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},


  //APARTADO PARA CLIENTE
  { path: 'cliente', component: ClienteLayoutComponent,  canActivate: [],
    children: [
    { path: 'dashboard', component: DashboardclienteComponent, canActivate: [ AuthGuard ], data: {
                                                        rol:'ROL_CLIENTE',
                                                        titulo: 'Dashboard Cliente',
                                                        breadcrums: []
                                                      },},

    { path: 'player/:uid', component: PlayerRutinasComponent, data: {
                                                        rol:'ROL_CLIENTE',
                                                        titulo: 'Player Rutinas',
                                                        breadcrums: [{titulo: 'Player Cliente'}]
                                                      },},

    { path: 'perfil', component: PerfilclienteComponent, data: {
                                                        rol:'ROL_CLIENTE',
                                                        titulo: 'Perfil Cliente',
                                                        breadcrums: [{titulo: 'Perfil Cliente'}]
                                                      },},

    { path: 'newpass/:uid', component: ReestablecerPasswordComponent, canActivate: [  ], data: {
                                                        titulo: 'Establecer Contraseña',
                                                        breadcrums: [{titulo: 'Dashboard Cliente', url: '/cliente/dashboard'}]
                                                      },},
    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'player/:uid', component: PlayerRutinasComponent, data: {
                                                        rol:'ROL_CLIENTE',
                                                        titulo: 'Player Rutinas',
                                                        breadcrums: [{titulo: 'Player Cliente'}]
                                                      },},


];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
