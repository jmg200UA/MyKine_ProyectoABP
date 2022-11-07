import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AppRoutingModule } from '../app-routing.module';
import { SelectusersComponent } from './selectusers/selectusers.component';
import { FooterClienteComponent } from './footer-cliente/footer-cliente.component';
import { GraficaBarraComponent } from './grafica-barra/grafica-barra.component';
import { ChartsModule } from 'ng2-charts';
import { DonutBarComponent } from './donut-bar/donut-bar.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    PaginationComponent,
    SelectusersComponent,
    FooterClienteComponent,
    GraficaBarraComponent,
    DonutBarComponent,

  ],
  exports: [
    BreadcrumbComponent,
    FooterComponent,
    FooterClienteComponent,
    NavbarComponent,
    SidebarComponent,
    PaginationComponent,
    SelectusersComponent,
    GraficaBarraComponent,
    DonutBarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ChartsModule
  ]
})
export class CommonsModule { }
