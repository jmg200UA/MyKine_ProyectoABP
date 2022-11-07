import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DragulaModule} from 'ng2-dragula';
import { AuthModule } from './auth/auth.module';
import { Auth2Module } from './auth2/auth2.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CommonsModule } from './commons/commons.module';
import { ClienteLayoutComponent } from './layouts/cliente-layout/cliente-layout.component';
import { NuevoinicioLayoutComponent } from './layouts/nuevoinicio-layout/nuevoinicio-layout.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ClienteLayoutComponent,
    NuevoinicioLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    Auth2Module,
    PagesModule,
    CommonsModule,
    DragulaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
