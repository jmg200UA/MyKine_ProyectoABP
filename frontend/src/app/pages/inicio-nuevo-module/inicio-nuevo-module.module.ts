import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { CommonsModule } from '../../commons/commons.module';
import { HttpClientModule } from '@angular/common/http';
import { MapaComponent } from './mapa/mapa.component';
import { BuscarLocalizacionComponent } from './buscar-localizacion/buscar-localizacion.component';
import { FisioComponent } from './fisio/fisio.component';



@NgModule({
  declarations: [
    LandingComponent,
    BusquedaComponent,
    MapaComponent,
    BuscarLocalizacionComponent,
    FisioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CommonsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
})
export class InicioNuevoModuleModule {}
