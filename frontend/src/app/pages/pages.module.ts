import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { PerfilComponent } from './perfil/perfil.component';

import { AdminModule } from './admin/admin.module';

import { CommonsModule } from '../commons/commons.module';

import { InicioNuevoModuleModule } from './inicio-nuevo-module/inicio-nuevo-module.module';

import { ModuloFisioModule } from './modulo-fisio/modulo-fisio.module';
import { ModuloClienteModule } from './modulo-cliente/modulo-cliente.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    PerfilComponent,
  ],
  exports: [
    AdminLayoutComponent,
    PerfilComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    AdminModule,
    ModuloFisioModule,
    ModuloClienteModule,

    CommonsModule,
    InicioNuevoModuleModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
