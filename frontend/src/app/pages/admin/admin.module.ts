import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonsModule } from '../../commons/commons.module';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';


import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { EjercicioComponent } from './ejercicio/ejercicio.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    UsuarioComponent,
    EstadisticasComponent,
    EjercicioComponent,
    EjerciciosComponent
  ],
  exports: [
    UsuariosComponent,
    UsuarioComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    ChartsModule
  ]
})
export class AdminModule { }
