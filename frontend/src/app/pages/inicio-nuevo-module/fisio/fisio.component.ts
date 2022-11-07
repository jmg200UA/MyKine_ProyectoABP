import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service'
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-fisio',
  templateUrl: './fisio.component.html',
  styleUrls: ['./fisio.component.css']
})
export class FisioComponent implements OnInit {

  @Input() fisioUid: '';
  @ViewChild('mapa') divMapa: ElementRef;

  constructor(private rutaActiva: ActivatedRoute, private usuarioService: UsuarioService) { }

  private uid;
  private usu;
  public imagenUrl = '';
  public nombre;
  public email;
  public valoracion;
  public especialidad;
  public lngLat: [number, number] = [-0.4889875822379246, 38.34315558848338];

  ngOnInit(): void {
    this.uid = this.rutaActiva.snapshot.params.id;
    this.cargandoFisio();
  }


  cargandoFisio(){
    this.usuarioService.cargarUsuarioBest(this.uid).subscribe( res => {
      this.usu = res;
      this.imagenUrl = this.crearImagenUrl(res['usuarios']['imagen']);
      this.nombre = res['usuarios']['nombre_apellidos'];
      this.email = res['usuarios']['email'];
      this.valoracion = res['usuarios']['valoracion'];
      this.especialidad = res['usuarios']['especialidad'];
      let lngLatMalo = res['usuarios']['sitio_Fisio']['localizacion_sitio'];
      let aux = lngLatMalo.split(",");
      let nuevoCentro: [number, number] = [parseFloat(aux[0]), parseFloat(aux[1])];

      let segundonumero: number = +aux[1];

      if (segundonumero < 5) {
        this.lngLat[0] = nuevoCentro[1];
        this.lngLat[1] = nuevoCentro[0];
      }else{
        this.lngLat[0] = nuevoCentro[0];
        this.lngLat[1] = nuevoCentro[1];
      }
      this.cargarMapa();
    });
  }

  cargarMapa(){
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 12, // starting zoom
      interactive: false
    });

    new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .addTo(mapa)
  }

  crearImagenUrl(imagen: string) {
    return this.usuarioService.crearImagenUrlBest(imagen);
  }

}
