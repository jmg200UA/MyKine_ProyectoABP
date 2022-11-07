import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonsModule } from 'src/app/commons/commons.module';

import { DashboardfisioComponent } from './dashboardfisio/dashboardfisio.component';
import { InformeComponent } from './informe/informe.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { GestionarclientesComponent } from './gestionarclientes/gestionarclientes.component';
import { ClienteComponent } from './cliente/cliente.component';
import { InformesComponent } from './informes/informes.component';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { RutinaComponent } from './rutina/rutina.component';
import { PlanmensualComponent } from './planmensual/planmensual.component';
import { ClientenuevoComponent } from './clientenuevo/clientenuevo.component';
import { Auth2Module } from 'src/app/auth2/auth2.module';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);


@NgModule({
  declarations: [
    DashboardfisioComponent,
    InformeComponent,
    RutinasComponent,
    GestionarclientesComponent,
    ClienteComponent,
    InformesComponent,
    RutinaComponent,
    PlanmensualComponent,
    ClientenuevoComponent
  ],
  exports: [
    GestionarclientesComponent,
    DashboardfisioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule,
    Auth2Module
  ]
})
export class ModuloFisioModule { }
