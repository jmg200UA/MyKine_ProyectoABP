import { Component, OnInit,  ElementRef, ViewChild, HostListener } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  @ViewChild('txtBuscarLoc') txtBuscarLoc!: ElementRef<HTMLInputElement>;

  //ATRIBUTOS
  public listaPremiums: Usuario[] = [];
  public totalusuarios;

  // public splitted;
  // public show=true;

  public loading = true;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;
  public ultimaBusqueda = '';
  public navbarfixed:boolean = false;

  public ciudadPasada: string = '';
  public especialidadPasada: string = '';
  public especialidadActual: string = '';

  constructor(private ususuarioService: UsuarioService,
              private _route: ActivatedRoute,
              private router: Router,
              ) {
                if (this._route.snapshot.paramMap.get('localizacion') != null) {
                  this.ciudadPasada = this._route.snapshot.paramMap.get('localizacion');
                }

                if (this._route.snapshot.paramMap.get('especialidad') != null) {
                  this.especialidadPasada = this._route.snapshot.paramMap.get('especialidad');
                }
              }

  ngOnInit(): void {

    if(this.especialidadPasada != '' ){
      this.cargarUsuariosPremiumPaginados(this.especialidadPasada);
      this.especialidadActual = this.especialidadPasada;
      this.cambiarColor();
    }else{
      this.cargarUsuariosPremiumPaginados(this.ultimaBusqueda);
    }
  }

  cargarUsuariosPremiumPaginados(textoBuscar: string){
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.ususuarioService.cargarUsuariosPremiumPaginados(this.posicionactual, textoBuscar)
    .subscribe (res => {
      if (res['usuarios'].length === 0) {
        if (this.posicionactual > 0) {
          this.posicionactual = this.posicionactual - this.registrosporpagina;
          if (this.posicionactual < 0) { this.posicionactual = 0};
          this.cargarUsuariosPremiumPaginados(this.ultimaBusqueda);
        } else {
          this.listaPremiums = [];
          this.totalusuarios = 0;
        }
      } else {
        this.listaPremiums = res['usuarios'];
        this.totalusuarios = res['page'].total;
      }
      this.loading = false;

    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      //console.warn('error:', err);
      this.loading = false;
    });

  }


  filtroboton(tipo){
    if(tipo != ''){
      if (tipo == 'general') {
        this.cargarUsuariosPremiumPaginados('');
        this.especialidadActual = tipo;
      }else{
        this.cargarUsuariosPremiumPaginados(tipo);
        this.especialidadActual = tipo;
      }
      this.cambiarColor();

    }
  }

  cambiarColor(){
    switch (this.especialidadActual) {
      case 'pediatria':
        document.getElementById("pediatria").style.backgroundColor = "#a7a7a7";
        document.getElementById("neurologia").style.backgroundColor = "#F8F9FA";
        document.getElementById("deportiva").style.backgroundColor = "#F8F9FA";
        document.getElementById("geriatria").style.backgroundColor = "#F8F9FA";
        break;
      case 'neurologia':
        document.getElementById("neurologia").style.backgroundColor = "#a7a7a7";
        document.getElementById("pediatria").style.backgroundColor = "#F8F9FA";
        document.getElementById("deportiva").style.backgroundColor = "#F8F9FA";
        document.getElementById("geriatria").style.backgroundColor = "#F8F9FA";
        break;
      case 'deportiva':
        document.getElementById("deportiva").style.backgroundColor = "#a7a7a7";
        document.getElementById("pediatria").style.backgroundColor = "#F8F9FA";
        document.getElementById("neurologia").style.backgroundColor = "#F8F9FA";
        document.getElementById("geriatria").style.backgroundColor = "#F8F9FA";
        break;
      case 'general':
        document.getElementById("pediatria").style.backgroundColor = "#F8F9FA";
        document.getElementById("neurologia").style.backgroundColor = "#F8F9FA";
        document.getElementById("deportiva").style.backgroundColor = "#F8F9FA";
        document.getElementById("geriatria").style.backgroundColor = "#F8F9FA";
        break;

      case 'geriatria':
        document.getElementById("geriatria").style.backgroundColor = "#a7a7a7";
        document.getElementById("pediatria").style.backgroundColor = "#F8F9FA";
        document.getElementById("neurologia").style.backgroundColor = "#F8F9FA";
        document.getElementById("deportiva").style.backgroundColor = "#F8F9FA";
        break;

      default:
        document.getElementById("pediatria").style.backgroundColor = "#F8F9FA";
        document.getElementById("neurologia").style.backgroundColor = "#F8F9FA";
        document.getElementById("deportiva").style.backgroundColor = "#F8F9FA";
        document.getElementById("geriatria").style.backgroundColor = "#F8F9FA";
        break;
    }
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarUsuariosPremiumPaginados(this.ultimaBusqueda);
  }

  crearImagenUrl(imagen: string) {
    return this.ususuarioService.crearImagenUrlBest(imagen);
  }

  fisio(id: string){
    if(id){
      // this.hijo.cargandoFisio(id);
      this.router.navigate(['/landing/fisio',id]);
    }
  }

  //Para position sticky
  @HostListener('window:scroll',['$event']) onscroll(){
    if(window.scrollY > 100)
    {
      this.navbarfixed = true;
    }
    else
    {
      this.navbarfixed = false;
    }
  }

}
