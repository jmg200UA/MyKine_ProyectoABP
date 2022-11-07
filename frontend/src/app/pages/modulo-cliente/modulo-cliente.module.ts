import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsModule } from 'src/app/commons/commons.module';

import { DashboardclienteComponent } from './dashboardcliente/dashboardcliente.component';
import { RutinasClienteComponent } from './rutinas-cliente/rutinas-cliente.component';
import { InformesClienteComponent } from './informes-cliente/informes-cliente.component';
import { PlayerRutinasComponent } from './player-rutinas/player-rutinas.component';
import { ModeloComponent } from './modelo/modelo.component';
import { ReestablecerPasswordComponent } from './reestablecer-password/reestablecer-password.component';
import { HistorialclienteComponent } from './historialcliente/historialcliente.component';
import { DatePipe } from '@angular/common';
import { PerfilclienteComponent } from './perfilcliente/perfilcliente.component';

@NgModule({
  declarations: [
    DashboardclienteComponent,
    RutinasClienteComponent,
    InformesClienteComponent,
    PlayerRutinasComponent,
    ModeloComponent,
    ReestablecerPasswordComponent,
    HistorialclienteComponent,
    PerfilclienteComponent
  ],
  exports: [
    DashboardclienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule
  ],
  providers:[
    DatePipe
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class ModuloClienteModule { }
